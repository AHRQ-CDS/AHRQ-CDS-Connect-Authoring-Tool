library "WithFunctionInFunction" version '1.0.0'

using FHIR version '4.0.0'

include "FHIRHelpers" version '4.0.0' called FHIRHelpers 
include "CDS_Connect_Commons_for_FHIRv400" version '1.0.1' called C3F 
include "CDS_Connect_Conversions" version '1' called Convert 

valueset "LDL Cholesterol VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1573'



context Patient

define "LDL Cholesterol":
  exists(C3F.ObservationLookBack([Observation: "LDL Cholesterol VS"], 1 year))

define "MeetsInclusionCriteria":
  "LDL Cholesterol"

define "InPopulation":
   "MeetsInclusionCriteria" 

define "Recommendation": 
  null

define "Rationale":
  null

define "Errors":
  null
