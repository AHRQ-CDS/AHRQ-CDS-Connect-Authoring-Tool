library "WithDuplicateFunctions" version '1.0.0'
using FHIR version '4.0.0'
include "FHIRHelpers" version '4.0.0' called FHIRHelpers 
valueset "Statins VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.824'
parameter "TestBoolean" default true
context Patient

define "Statins Low":
  HighestObservation([Observation: "Statins VS"]) <= 100 'mg/dL'

define "Statins High":
  HighestObservation([Observation: "Statins VS"]) >= 135 'mg/dL'


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


define function HighestObservation(ObsList List<Observation>):
  Max(ObsList O return FHIRHelpers.ToQuantity(O.value as FHIR.Quantity))
