library "WithDuplicateFunctions" version '1.0.0'

using FHIR version '4.0.0'

include "FHIRHelpers" version '4.0.0' called FHIRHelpers 
include "CDS_Connect_Commons_for_FHIRv400" version '1.0.1' called C3F 
include "CDS_Connect_Conversions" version '1' called Convert 

valueset "Statins VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.824'


parameter "TestBoolean" default true

context Patient

define "Statins Low":
  C3F.HighestObservation([Observation: "Statins VS"]) <= 100 'mg/dL'

define "Statins High":
  C3F.HighestObservation([Observation: "Statins VS"]) >= 135 'mg/dL'


define "MeetsInclusionCriteria":
  "TestBoolean"

define "MeetsExclusionCriteria":
  "StatinsLow"
  and "StatinsHigh"

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
