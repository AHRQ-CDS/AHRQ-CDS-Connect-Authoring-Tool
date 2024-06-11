library "WithFunctionInFunction" version '1.0.0'
using FHIR version '4.0.0'
include "FHIRHelpers" version '4.0.0' called FHIRHelpers 
valueset "LDL Cholesterol VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1573'
context Patient

define "LDL Cholesterol":
  exists(ObservationLookBack([Observation: "LDL Cholesterol VS"], 1 year))

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


define function ObservationLookBack(ObsList List<Observation>, LookBack System.Quantity):
  ObsList O
    let LookBackInterval: Interval[Now() - LookBack, Now()]
    where (O.effective as FHIR.dateTime).value in LookBackInterval
      or (O.effective as FHIR.instant).value in LookBackInterval
      or PeriodToInterval(O.effective as FHIR.Period) overlaps LookBackInterval
      or O.issued.value in LookBackInterval

define function PeriodToInterval(period FHIR.Period):
  if period is null then
    null
  else
    Interval[period."start".value, period."end".value]
