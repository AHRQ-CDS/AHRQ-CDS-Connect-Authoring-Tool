library "WithoutParameter" version '1.0.0'

using FHIR version '4.0.0'

include "FHIRHelpers" version '4.0.0' called FHIRHelpers 
include "CDS_Connect_Commons_for_FHIRv400" version '1.0.1' called C3F 
include "CDS_Connect_Conversions" version '1' called Convert 

valueset "Allergy to Eggs VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.2.1346'
valueset "Statins VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.824'



context Patient

define "Allergy to Eggs":
  exists(C3F.ActiveOrConfirmedAllergyIntolerance([AllergyIntolerance: "Allergy to Eggs VS"]))

define "Statins":
  C3F.HighestObservation([Observation: "Statins VS"]) >= 135 'mg/dL'


define "MeetsInclusionCriteria":
  "Allergy to Eggs"

define "MeetsExclusionCriteria":
  "Statins"

define "InPopulation":
  "MeetsInclusionCriteria" and not "MeetsExclusionCriteria" 

define "Recommendation": 
  if "InPopulation" then ''
  else null

define "Rationale":
  if "InPopulation" then null
  else null

define "Errors":
  if null then
    {''}
  else null
