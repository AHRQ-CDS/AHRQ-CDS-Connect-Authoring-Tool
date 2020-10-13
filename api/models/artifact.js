const mongoose = require('mongoose');
const codeSystems = require('../data/codeSystems');
const contextMappings = require('../data/contextMappings');
const _ = require('lodash');
const nuccProviderTaxonomy = require('../../frontend/src/data/nuccProviderTaxonomyV20.0'); // http://nucc.org/
const fhirWorkflowTaskCodes = require('../../frontend/src/data/fhirWorkflowTaskCodesV3'); // https://terminology.hl7.org/1.0.0/ValueSet-v3-ActTaskCode.html
const fhirClinicalVenueCodes = require('../../frontend/src/data/fhirClinicalVenueCodesV3'); // https://terminology.hl7.org/1.0.0/ValueSet-v3-ServiceDeliveryLocationRoleType.html


const Schema = mongoose.Schema;

const ArtifactSchema = new Schema({
  name: String,
  version: String,
  description: String,
  url: String,
  status: String,
  experimental: Boolean,
  publisher: String,
  context: Array,
  purpose: String,
  usage: String,
  copyright: String,
  approvalDate: Date,
  lastReviewDate: Date,
  effectivePeriod: {
    start: Date,
    end: Date
  },
  topic: Array,
  author: Array,
  reviewer: Array,
  endorser: Array,
  relatedArtifact: Array,
  fhirVersion: String,
  expTreeInclude: Object,
  expTreeExclude: Object,
  recommendations: Array,
  subpopulations: Array,
  baseElements: Array,
  parameters: Array,
  errorStatement: Object,
  uniqueIdCounter: Number,
  user: String
}, {
  timestamps: true // adds created_at, updated_at
});

//Convert the schema into an CPG Publishable Library JSON object
ArtifactSchema.methods.toPublishableLibrary = function(){

  //the ultimate value to return
  let retVal = {};

  retVal["resourceType"] = "Library";
  retVal["type"] = {
    "coding" : [
      {
        "system" : "http://terminology.hl7.org/CodeSystem/library-type",
        "code" : "logic-library",
        "display" : "Logic Library"
      }
    ]
  };

  //name should be machine readable
  retVal["name"] = this.name.replace(/\s/g, "_");
  retVal["title"] = this.name;
  retVal["date"] = this.updatedAt;
  retVal["version"] = this.version;
  retVal["description"] = this.description;
  retVal["url"] = this.url;
  retVal["status"] = this.status || "draft";  //default to draft, this field is _required_ by FHIR
  retVal["experimental"] = this["experimental"];
  retVal["publisher"] = this.publisher;
  retVal["useContext"] = this.convertContext();
  retVal["purpose"] = this.purpose;

  //date fields SHALL NOT have a time according to the Publishable Library spec
  if(this.approvalDate){
    retVal["approvalDate"] = this.approvalDate.toISOString().split("T")[0];
  }
  if(this.lastReviewDate){
    retVal["lastReviewDate"] = this.lastReviewDate.toISOString().split("T")[0];
  }
  //handle the effective period, which SHALL NOT have time as per the spec (similar to date fields above)
  if(!(_.matches(this.effectivePeriod,{}))){
    retVal["effectivePeriod"] = {};
    if(this.effectivePeriod.start){
      retVal["effectivePeriod"]["start"] = this.effectivePeriod.start.toISOString().split("T")[0];
    }
    if(this.effectivePeriod.end){
      retVal["effectivePeriod"]["end"] = this.effectivePeriod.end.toISOString().split("T")[0];
    }
  }
  //handle the topic as a CodeableConcept
  if(this.topic && this.topic.length > 0){
    //filter any null input
    retVal["topic"] = this.topic.filter(function(t){
      return !(t.system === null);
    }).map(function(t){
      return {
        coding: [
          {
            system: codeSystems.find(x => x.value === t.system)["id"],
            code: t.code,
          }
        ]
      }
    });
    //if its empty, remove it
    _.isEmpty(retVal["topic"]) && delete retVal["topic"];
  }

  const contactFields = ["author","reviewer","endorser","editor"];
  //map the contacts, remove any empty lists
  contactFields.forEach(field => {
    retVal[field] = this.mapContact(field);
    _.isEmpty(retVal[field]) && delete retVal[field];
  });

  //map the related artifacts
  if(this.relatedArtifact && this.relatedArtifact.length > 0){
    //remove any null fields
    retVal["relatedArtifact"] = this.relatedArtifact.filter(function(artifact){
      return !(artifact["relatedArtifactType"] === null);
    }).map(function(artifact){
      return{
        type: artifact["relatedArtifactType"],
        display: artifact["description"],
        url: artifact["url"],
        citation: artifact["citation"],
      }
    });
    _.isEmpty(retVal["relatedArtifact"]) && delete retVal["relatedArtifact"];
  }

  //remove any fields that have empty/null/undefined values
  //modified from: https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
  const removeEmpty = retVal => Object.keys(retVal).forEach(key => {
    if (retVal[key] && typeof retVal[key] === "object") removeEmpty(retVal[key]); // recurse
    else if ( (_.isEmpty(retVal[key])) || (_.isUndefined(retVal[key])) || (_.isNull(retVal[key])) ) delete retVal[key];
  });
  removeEmpty(retVal);
  return retVal;
};

//helper function to map contacts into CPG form.  used by toPublishableLibrary()
ArtifactSchema.methods.mapContact = function(contactType){
  if(this[contactType] && this[contactType].length > 0){
    //remove any empty string contacts, then map the contacts
    return this[contactType].filter(function(ct){
      return(ct[contactType] !== "");
    }).map(function(contact){
      if(contact[contactType] !== ""){
        return {name: contact[contactType]};
      }
    });
  }
};

//Handling context can be gnarly, so we're separating that into its own function
ArtifactSchema.methods.convertContext = function(){
  if(this.context.length > 0) {
    //filter out invalid inputs
    return this.context.filter(function(ctx){
      return !(
        ctx[ctx["contextType"]] === null ||
        ctx["program"] === "" ||
        ctx["system"] === null ||
        ctx["ageRangeUnitOfTime"] === null
      );
    }).map(function(context){
      let type = context["contextType"];
      let ctxMap = contextMappings.find(x => x.type === type);
      //the object we'll build into CPG format
      let tmpCtx = {};
      let code,tax,display,workflowDef,venueDef;
      switch (type) {
        case "ageRange":
          tmpCtx = {
            code: {
              "system": "http://terminology.hl7.org/CodeSystem/usage-context-type",
              "code": "age"
            },
            valueRange: {
              low: {
                value: new Number(context["ageRangeMin"]),
                unit: context["ageRangeUnitOfTime"],
                system: "http://unitsofmeasure.org",
                code: ctxMap["codes"][context["ageRangeUnitOfTime"]],
              },
              high: {
                value: new Number(context["ageRangeMax"]),
                unit: context["ageRangeUnitOfTime"],
                system: "http://unitsofmeasure.org",
                code: ctxMap["codes"][context["ageRangeUnitOfTime"]],
              }
            }
          };
          break;
        case "clinicalFocus":
          tmpCtx = {
            code: {
              "system": "http://terminology.hl7.org/CodeSystem/usage-context-type",
              "code": "focus"
            },
            valueCodeableConcept: {
              coding: [{
                system: codeSystems.find(x => x.value === context["system"]).id,
                code: context["code"]
              }]
            }
          };
          break;
        case "userType":
          code = context["userType"].split("user-")[1];
          tax = _.find(nuccProviderTaxonomy,{"Code":code} );
          display = tax["Classification"];
          if(!(_.isEmpty(tax["Specialization"]))){
            display = tax["Specialization"];
          }
          tmpCtx = {
            code: {
              "system": "http://terminology.hl7.org/CodeSystem/usage-context-type",
              "code": "user"
            },
            valueCodeableConcept: {
              "coding": [
                {
                  system: ctxMap["system"],
                  code: code,
                  display: display
                }
              ]
            }
          };
          break;
        case "workflowSetting":
          code = context["workflowSetting"];
          tmpCtx = {
            code: {
              "system": "http://terminology.hl7.org/CodeSystem/usage-context-type",
              "code": "workflow"
            },
            valueCodeableConcept: {
              "coding": [
                {
                  system: ctxMap["system"],
                  code: ctxMap[code]["code"],
                  display: ctxMap[code]["display"],
                }
              ]
            }
          };
          break;
        case "workflowTask":
          code = context["workflowTask"];
          workflowDef = _.find(fhirWorkflowTaskCodes, {"Code":code});
          tmpCtx = {
            code: {
              "system": "http://terminology.hl7.org/CodeSystem/usage-context-type",
              "code": "task"
            },
            valueCodeableConcept: {
              "coding": [
                {
                  system: ctxMap["system"],
                  code: workflowDef["Code"],
                  display: workflowDef["Display"],
                }
              ]
            }
          };
          break;
        case "clinicalVenue":
          code = context["clinicalVenue"];
          venueDef = _.find(fhirClinicalVenueCodes, {"Code":code});
          tmpCtx = {
            code: {
              "system": "http://terminology.hl7.org/CodeSystem/usage-context-type",
              "code": "venue"
            },
            valueCodeableConcept: {
              "coding": [
                {
                  system: ctxMap["system"],
                  code: venueDef["Code"],
                  display: venueDef["Display"],
                }
              ]
            }
          };
          break;
        case "species":
          tmpCtx = {
            code: {
              "code": "species",
              "system": "http://terminology.hl7.org/CodeSystem/usage-context-type"
            },
            valueCodeableConcept: {
              coding: [{
                system: codeSystems.find(x => x.value === context["system"]).id,
                code: context["code"]
              }]
            }
          };
          break;
        case "program":
          tmpCtx = {
            code: {
              "system": "http://terminology.hl7.org/CodeSystem/usage-context-type",
              "code": "program",
            },
            valueCodeableConcept: {
              text: context["program"],
            }
          };
          break;

        default: //default to CodeableConcept
          //as of right now, program maps to the default CodeableConcept format
          tmpCtx = {
            code: {
              "system": "http://terminology.hl7.org/CodeSystem/usage-context-type",
              "code": type
            },
            valueCodeableConcept: {
              "coding": [
                {
                  system: ctxMap["system"],
                  code: ctxMap[context[type]]["code"],
                  display: ctxMap[context[type]]["display"],
                }
              ]
            }
          };
      }
      return tmpCtx;
    });
  }
};
module.exports = mongoose.model('Artifact', ArtifactSchema);
