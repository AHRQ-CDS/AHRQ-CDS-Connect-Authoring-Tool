library CDS_Connect_Commons_for_FHIRv102 version '1.3.0'

using FHIR version '1.0.2'

// Include the FHIRHelpers library for simplifying interacton w/ the FHIR data model
include FHIRHelpers version '1.0.2' called FHIRHelpers

// -------------------------------------------------- GENERAL ---------------------------------------------------------

/**
 * A null-safe version of ToConcept.  Whereas FHIRHelpers.ToConcept will take a null argument and produce a
 * System.Concept that is empty, this implementation returns null instead.
 * @param C - a FHIR CodeableConcept
 * @returns {System.Concept} a CQL Concept or null if null was passed in
 */
define function NullSafeToConcept(Cpt FHIR.CodeableConcept):
  if Cpt is not null then FHIRHelpers.ToConcept(Cpt) else null

/**
 * A null-safe version of ToInterval.  Whereas FHIRHelpers.ToInterval will take a null argument and produce a
 * System.Interval that is empty, this implementation returns null instead.
 * @param P - a FHIR Period
 * @returns {System.Interval} a CQL Interval or null if null was passed in
 */
define function NullSafeToInterval(Pd FHIR.Period):
  if Pd is not null then Interval[Pd."start".value, Pd."end".value] else null

/**
 * A null-safe version of ToQuantity.  Whereas FHIRHelpers.ToQuantity will take a null argument and produce a
 * System.Quantity that is empty, this implementation returns null instead.
 * @param C - a FHIR Quantity
 * @returns {System.Quantity} a CQL Quantity or null if null was passed in
 */
define function NullSafeToQuantity(Qty FHIR.Quantity):
  if Qty is not null then
    System.Quantity {
      value: Qty.value.value,
      unit: Coalesce(Qty.unit.value, Qty.code.value)
    }
  else null

// -------------------------------------------------- OBSERVATIONS -----------------------------------------------------

/**
 * Filters Observations by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<Observation>} a list of Observations matching the concept, or null if null was passed in
 */
define function ObservationsByConcept(Koncept System.Concept):
  [Observation] O where NullSafeToConcept(O.code) ~ Koncept

/**
 * Observations that are complete and verified. In FHIR DSTU2, there are two statuses that indicate this state: 'final'
 * and 'amended'.
 * @see http://hl7.org/fhir/DSTU2/valueset-observation-status.html
 * @param ObsList - a list of Observations
 * @returns {List<Observation>} a list of verified Observations, or null if null was passed in
 */
define function Verified(ObsList List<Observation>):
  ObsList O where O.status.value in {'final', 'amended'}

/**
 * Observations that have quantity values recorded in the requested unit.
 * @param ObsList - a list of Observations
 * @param Unit - the unit to require in the Observations quantity value
 * @returns {List<Observation>} a list of Observations with the required unit, or null if null was passed in
 */
define function WithUnit(ObsList List<Observation>, Unit String):
  ObsList O where O.valueQuantity.unit.value = Unit or O.valueQuantity.code.value = Unit

/**
 * Observations with an effective or issued date in the specified "look back" period.  For example, LDL-C Tests in the
 * last 6 years.
 * TODO: Rename to LookBack once the execution engine supports overloaded functions.
 * @param ObsList - a list of Observations
 * @returns {List<Observation>} a list of Observations with effective or issued date specified lookback period, or null
 * if null was passed in
 */
define function ObservationLookBack(ObsList List<Observation>, LookBack System.Quantity):
  ObsList O
    let LookBackInterval: Interval[Now() - LookBack, Now()]
    where O.effectiveDateTime.value in LookBackInterval
      or NullSafeToInterval(O.effectivePeriod) overlaps LookBackInterval
      or O.issued in LookBackInterval

/**
 * The most recent observation.  For each Observation, this algorithm will use the FindDate function, which uses the
 * first non-null date value from these fields: effectiveDateTime, effectivePeriod.end, effectivePeriod.start, issued.
 * The found date will be used to compare Observations and determine the most recent one.
 * @see FindDate(Observation)
 * @param ObsList - a list of Observations
 * @returns {Observation} the most recent Observation from the list, or null if null was passed in
 */
define function MostRecent(ObsList List<Observation>):
  Last(ObsList O sort by Coalesce(effectiveDateTime.value, effectivePeriod."end".value, effectivePeriod."start".value, issued.value))

/**
 * Extracts the quantity value from an Observation, returning it as a CQL Quantity
 * @param Obs - an observation
 * @returns {System.Quantity} the Observation's value as a quantity, or null if there is no quantity value
 */
define function QuantityValue(Obs Observation):
  NullSafeToQuantity(Obs.valueQuantity)

/**
 * Extracts the CodeableConcept value from an Observation, returning it as a CQL Concept
 * @param Obs - an observation
 * @returns {System.Concept} the Observation's value as a concept, or null if there is no CodeabeConcept value
 */
define function ConceptValue(Obs Observation):
  NullSafeToConcept(Obs.valueCodeableConcept)

/**
 * Finds the first non-null meaningful date that can be associated with this Observation.  This will look through the
 * following fields in the following order: effectiveDateTime, effectivePeriod.end, effectivePeriod.start, issued.
 * @param Obs - an Observation
 * @returns {System.DateTime} the first non-null meaningful date, or null if non is found
 */
define function FindDate(Obs Observation):
  Coalesce(Obs.effectiveDateTime.value, Obs.effectivePeriod."end".value, Obs.effectivePeriod."start".value, Obs.issued.value)

// TODO: Confirm that this works as expected
/**
 * The highest observation. 
 * The value will be used to compare Observations and determine the highest one.
 * @param ObsList - a list of Observations
 * @returns {System.Quantity} the quantity with the highest value from the list, or null if null was passed in
 */
define function HighestObservation(ObsList List<Observation>):
  Max(ObsList O return NullSafeToQuantity(O.valueQuantity))


// -------------------------------------------------- CONDITIONS -------------------------------------------------------

/**
 * Filters Conditions by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<Observation>} a list of Conditions matching the concept, or null if null was passed in
 */
define function ConditionsByConcept(Koncept System.Concept):
  [Condition] C where NullSafeToConcept(C.code) ~ Koncept

/**
 * Conditions that are confirmed. In FHIR DSTU2, this is reflected by verificationStatus: 'confirmed'.
 * @see http://hl7.org/fhir/DSTU2/valueset-condition-ver-status.html
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of confirmed Conditions, or null if null was passed in
 */
define function Confirmed(CondList List<Condition>):
  CondList C where C.verificationStatus.value = 'confirmed'

/**
 * Conditions that are active. In FHIR DSTU2, this is reflected by clinicalStatus: 'active' and the absence of any
 * abatement information (i.e., if it abated, it is no longer active).
 * TODO: Rename to Active once the execution engine supports overloaded functions.
 * @see http://hl7.org/fhir/DSTU2/valueset-condition-clinical.html
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of active Conditions, or null if null was passed in
 */
define function ActiveCondition(CondList List<Condition>):
  CondList C
    where C.clinicalStatus.value = 'active'
      and C.abatementDateTime is null
      and C.abatementQuantity is null
      and C.abatementBoolean.value is not true
      and C.abatementPeriod is null
      and C.abatementRange is null
      and C.abatementString is null

/**
 * Conditions that are active or recurring. In FHIR DSTU2, this is reflected by clinicalStatus: 'active' or 'relapse'.
 * We do not check for null abatement information because it may have dates from when the now recurring condition
 * initially went into remission.
 * @see http://hl7.org/fhir/DSTU2/valueset-condition-clinical.html
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of active or recurring Conditions, or null if null was passed in
 */
define function ActiveOrRecurring(CondList List<Condition>):
  CondList C where C.clinicalStatus.value in {'active', 'relapse'}

/**
 * Conditions with an onset or recorded date in the specified "look back" period.  For example, pregnancy in
 * the last 42 weeks.
 * TODO: Rename to LookBack once the execution engine supports overloaded functions.
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of Conditions with onset or recorded date specified lookback period, or null
 * if null was passed in
 */
define function ConditionLookBack(CondList List<Condition>, LookBack System.Quantity):
  CondList C
    let LookBackInterval: Interval[Now() - LookBack, Now()]
    where C.onsetDateTime.value in LookBackInterval
      or NullSafeToInterval(C.onsetPeriod) overlaps LookBackInterval
      or C.dateRecorded in LookBackInterval 

/**
 * The most recent condition.  For each Condition, this algorithm will use the Coalesce function, which uses the
 * first non-null result from these fields: onsetDateTime, onsetPeriod.end, onsetPeriod.start, dateRecorded.
 * The found date will be used to compare Conditions and determine the most recent one.
 * @param CondList - a list of Conditions
 * @returns {Condition} the most recent Condition from the list, or null if null was passed in
 */
define function MostRecentCondition(CondList List<Condition>):
  Last(CondList C sort by Coalesce(onsetDateTime.value, onsetPeriod."end".value, onsetPeriod."start".value, dateRecorded.value))

 // -------------------------------------------------- PROCEDURES ------------------------------------------------------

 /**
  * Filters Procedures by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
  * but for now, we must use a query where clause.
  * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
  * @returns {List<Procedure>} a list of Procedures matching the concept, or null if null was passed in
  */
 define function ProceduresByConcept(Koncept System.Concept):
   [Procedure] P where NullSafeToConcept(P.code) ~ Koncept

/**
 * Procedures that are completed. In FHIR DSTU2, this is reflected by status: 'completed'.  In addition, the
 * notPerformed flag must be checked to ensure it is not 'true'.
 * @see http://hl7.org/fhir/DSTU2/valueset-procedure-status.html
 * @param ProcList - a list of Procedures
 * @returns {List<Procedure>} a list of completed Procedures, or null if null was passed in
 */
define function Completed(ProcList List<Procedure>):
  ProcList P
    where P.status.value = 'completed'
      and P.notPerformed.value is not true

/**
 * Procedures that are in progress. In FHIR DSTU2, this is reflected by status: 'in-progress'.  In addition, the
 * notPerformed flag must be checked to ensure it is not 'true'.
 * @see http://hl7.org/fhir/DSTU2/valueset-procedure-status.html
 * @param ProcList - a list of Procedures
 * @returns {List<Procedure>} a list of completed Procedures, or null if null was passed in
 */
define function ProcedureInProgress(ProcList List<Procedure>):
  ProcList P
    where P.status.value = 'in-progress'
      and P.notPerformed.value is not true

/**
 * Procedures performed in the specified "look back" period.  For example, PCIs performed in the
 * past 2 weeks.
 * TODO: Rename to LookBack once the execution engine supports overloaded functions.
 * @param ProcList - a list of Procedures
 * @param LookBack - the lookback period for when the procedure was performed
 * @returns {List<Procedure>} a list of Procedures performed in the look back period, or null if null
 * was passed in
 */
define function ProcedureLookBack(ProcList List<Procedure>, LookBack System.Quantity):
  ProcList P
    let LookBackInterval: Interval[Now() - LookBack, Now()]
    where P.performedDateTime.value in LookBackInterval
      or NullSafeToInterval(P.performedPeriod) overlaps LookBackInterval

/**
 * The most recent procedure.  For each Procedure, this algorithm will use the Coalesce function, which returns the
 * first non-null result from these fields: performedDateTime, performedPeriod.end, performedPeriod.start.
 * The found date will be used to compare Procedures and determine the most recent one.
 * @param ProcList - a list of Procedures
 * @returns {Procedure} the most recent Procedure from the list, or null if null was passed in
 */
define function MostRecentProcedure(ProcList List<Procedure>):
  Last(ProcList P sort by Coalesce(performedDateTime.value, performedPeriod."end".value, performedPeriod."start".value))

// -------------------------------------------------- MEDICATIONS ------------------------------------------------------

/**
 * Filters MedicationStatements by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<MedicationStatement>} a list of MedicationStatement matching the concept, or null if null was passed in
 */
define function MedicationStatementsByConcept(Koncept System.Concept):
  [MedicationStatement] M where NullSafeToConcept(M.medicationCodeableConcept) ~ Koncept

/**
 * Filters MedicationOrders by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<MedicationOrder>} a list of MedicationOrders matching the concept, or null if null was passed in
 */
define function MedicationOrdersByConcept(Koncept System.Concept):
  [MedicationOrder] M where NullSafeToConcept(M.medicationCodeableConcept) ~ Koncept

/**
 * Medications that are active, according to a statement, but not necessarily verified via a prescription.  For example,
 * medications that a patient has self-reported to be taking.  In FHIR DSTU2, this is reflected by MedicationStatement
 * with status 'active', no flag indicating it wasn't taken, and no end date or an end date in the future.
 * TODO: Rename to Active once the execution engine supports overloaded functions.
 * @see http://hl7.org/fhir/DSTU2/valueset-medication-statement-status.html
 * @param MedList - a list of MedicationStatements
 * @returns {List<MedicationStatement>} a list of active medication statements, or null if null was passed in
 */
define function ActiveMedicationStatement(MedList List<MedicationStatement>):
  MedList M
    let EffectivePeriod: NullSafeToInterval(M.effectivePeriod)
    where M.status.value = 'active'
      and M.wasNotTaken.value is not true
      and (end of EffectivePeriod is null or end of EffectivePeriod after Now())

/**
* Medications that are active, according to a prescription.  In FHIR DSTU2, this is reflected by MedicationOrder
* with status 'active' and no dateEnded.  There is currently an open question in the FHIR chat to determine if this
* is the right approach.
* TODO: Revisit based on outcome of FHIR chat.
* TODO: Rename to Active once the execution engine supports overloaded functions.
* @see https://chat.fhir.org/#narrow/stream/implementers/topic/Meaning.20of.20.22active.22.20and.20.22completed.22.20in.20MedicationRequest
* @see http://hl7.org/fhir/DSTU2/valueset-medication-order-status.html
* @param MedList - a list of MedicationOrders
* @returns {List<MedicationOrder>} a list of active medication orders, or null if null was passed in
*/
define function ActiveMedicationOrder(MedList List<MedicationOrder>):
  MedList M
    where M.status.value = 'active'
      and M.dateEnded.value is null
      
/**
* Medications that are active or completed, according to a prescription.  In FHIR DSTU2, this is reflected by MedicationOrder
* with status 'active' or 'completed'
* @see http://hl7.org/fhir/DSTU2/valueset-medication-order-status.html
* @param MedList - a list of MedicationOrders
* @returns {List<MedicationOrder>} a list of active medication orders, or null if null was passed in
*/
define function ActiveOrCompletedMedicationOrder(MedList List<MedicationOrder>):
  MedList M
    where M.status.value = 'active'
      or M.status.value = 'completed'

/**
* Medication Orders that are issued in the specified "look back" period.
* TODO: Rename to LookBack once the execution engine supports overloaded functions.
* @param MedList - a list of Medications
* @param LookBack - the lookback period for when the medication was prescribed
* @returns {List<MedicationOrder>} a list of Medications prescribed in the look back period, or null if null
* was passed in
*/
define function MedicationOrderLookBack(MedList List<MedicationOrder>, LookBack System.Quantity):
MedList M
  let LookBackInterval: Interval[Now() - LookBack, Now()]
  where M.dateWritten.value in LookBackInterval
    or M.dateEnded.value in LookBackInterval

/**
* Medication Statements that are issued in the specified "look back" period.
* TODO: Rename to LookBack once the execution engine supports overloaded functions.
* @param MedList - a list of Medications
* @param LookBack - the lookback period for when the medication was prescribed
* @returns {List<MedicationStatement>} a list of Medications prescribed in the look back period, or null if null
* was passed in
*/
define function MedicationStatementLookBack(MedList List<MedicationStatement>, LookBack System.Quantity):
MedList M
  let LookBackInterval: Interval[Now() - LookBack, Now()]
  where M.effectiveDateTime.value in LookBackInterval
    or NullSafeToInterval(M.effectivePeriod) overlaps LookBackInterval

// -------------------------------------------------- ENCOUNTERS ------------------------------------------------------

/**
 * Filters Encounters by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<Encounter>} a list of Encounters matching the concept, or null if null was passed in
 */
define function EncountersByConcept(Koncept System.Concept):
  [Encounter] E where exists( (E.type) ET where NullSafeToConcept(ET) ~ Koncept )

/**
 * Encounters that are in progress. In FHIR DSTU2, this is reflected by status: 'in-progress'.
 * @see http://hl7.org/fhir/DSTU2/valueset-encounter-state.html
 * @param EncList - a list of Encounters
 * @returns {List<Encounter>} a list of in progress encounters, or null if null was passed in
 */
define function InProgress(EncList List<Encounter>):
  EncList E
    where E.status.value = 'in-progress'
    
// -------------------------------------------------- ALLERGY INTOLERANCES ------------------------------------------------------

/**
 * Filters AllergyIntolerances by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<AllergyIntolerance>} a list of Allergy Intolerances matching the concept, or null if null was passed in
 */
define function AllergyIntolerancesByConcept(Koncept System.Concept):
  [AllergyIntolerance] A where NullSafeToConcept(A.substance) ~ Koncept

/**
* AllergyIntolerances that are active or confirmed.  In FHIR DSTU2, this is reflected by AllergyIntolerance
* with status 'active' or 'confirmed'
* @see http://hl7.org/fhir/DSTU2/valueset-allergy-intolerance-status.html
* @param AllergyIntolList - a list of AllergyIntolerances
* @returns {List<AllergyIntolerance>} a list of active or confirmed allergy intolerances, or null if null was passed in
*/
define function ActiveOrConfirmedAllergyIntolerance(AllergyIntolList List<AllergyIntolerance>):
  AllergyIntolList A
    where A.status.value = 'active'
      or A.status.value = 'confirmed'