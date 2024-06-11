library "Standard" version '1.0.0'
using FHIR version '4.0.0'
include "FHIRHelpers" version '4.0.0' called FHIRHelpers 
codesystem "FOO": 'foo'
codesystem "AICLINSTATUS": 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical'
codesystem "AIVERSTATUS": 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification'
valueset "Allergy to Eggs VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.2.1346'
valueset "Statins VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.824'
code "BAR": 'bar' from "FOO" display 'bar'
code "AllergyIntolerance Active code": 'active' from "AICLINSTATUS" display 'Active'
code "AllergyIntolerance Confirmed code": 'confirmed' from "AIVERSTATUS" display 'Confirmed'
concept "BAZ": { "BAR" } display 'baz'
concept "AllergyIntolerance Active": { "AllergyIntolerance Active code" } display 'Active'
concept "AllergyIntolerance Confirmed": { "AllergyIntolerance Confirmed code" } display 'Confirmed'
parameter "TestBoolean" default true
context Patient

define "Allergy to Eggs":
  exists(ActiveOrConfirmedAllergyIntolerance([AllergyIntolerance: "Allergy to Eggs VS"]))

define "Statins":
  HighestObservation([Observation: "Statins VS"]) >= 135 'mg/dL'


define "MeetsInclusionCriteria":
  "Allergy to Eggs"
  and "TestBoolean"

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


define function HighestObservation(ObsList List<Observation>):
  Max(ObsList O return FHIRHelpers.ToQuantity(O.value as FHIR.Quantity))

define function ActiveOrConfirmedAllergyIntolerance(AllergyIntolList List<AllergyIntolerance>):
  AllergyIntolList A
    where A.clinicalStatus ~ "AllergyIntolerance Active"
      or A.verificationStatus ~ "AllergyIntolerance Confirmed"
