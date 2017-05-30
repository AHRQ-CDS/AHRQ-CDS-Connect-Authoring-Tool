library CDS_Connect_Commons_for_FHIRv102 version '1'

using FHIR version '1.0.2'

// Include the FHIRHelpers library for simplifying interacton w/ the FHIR data model
include FHIRHelpers version '1.0.2' called FHIRHelpers

// -------------------------------------------------- OBSERVATIONS -----------------------------------------------------

/**
 * Filters Observations by a specific code rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Kode - the code to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<Observation>} a list of Observations matching the code, or null if null was passed in
 */
define function ObservationsByCode(Kode System.Code):
  [Observation] O where FHIRHelpers.ToConcept(O.code) ~ Kode

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
 * Observations that are complete and verified and have a recorded value in the requested unit.
 * @see Verified(List<Observaton>)
 * @see WithUnit(List<Observation>)
 * @param ObsList - a list of Observations
 * @param Unit - the unit to require in the Observations quantity value
 * returns {List<Observation>} a list of verified Observations with the required unit, or null if null was passed in
 */
define function VerifiedWithUnit(ObsList List<Observation>, Unit String):
  Verified(WithUnit(ObsList, Unit))

/**
 * The most recent observation (according to issued date)
 * @param ObsList - a list of Observations
 * @returns {Observation} the most recent Observation from the list, or null if null was passed in
 */
define function MostRecent(ObsList List<Observation>):
  Last(ObsList O sort by O.issued)

/**
 * Extracts the quantity value from an Observation, returning it as a CQL Quantity
 * @param Obs - an observation
 * @returns {System.Quantity} the Observation's value as a quantity, or null if there is no quantity value
 */
define function QuantityValue(Obs Observation):
  FHIRHelpers.ToQuantity(Obs.valueQuantity)

/**
 * Extracts the quantity value from the most recent Observation, returning it as a CQL Quantity
 * @param Obs - an observation
 * @see MostRecent(List<Observation>)
 * @see QuantityValue(Observation)
 * @returns {System.Quantity} the most recent Observation's value as a quantity, or null if there is no quantity value
 */
define function QuantityValueOfMostRecent(Obs List<Observation>):
  QuantityValue(MostRecent(Obs))

/**
 * Extracts the CodeableConcept value from an Observation, returning it as a CQL Concept
 * @param Obs - an observation
 * @returns {System.Concept} the Observation's value as a concept, or null if there is no CodeabeConcept value
 */
define function ConceptValue(Obs Observation):
  FHIRHelpers.ToConcept(Obs.valueCodeableConcept)

/**
 * Extracts the CodeableConcept value from the most recent Observation, returning it as a CQL Concept
 * @param Obs - an observation
 * @see MostRecent(List<Observation>)
 * @see ConceptValue(Observation)
 * @returns {System.Concept} the most recent Observation's value as a concept, or null if there is no CodeableConcept value
 */
define function ConceptValueOfMostRecent(Obs List<Observation>):
  ConceptValue(MostRecent(Obs))

// -------------------------------------------------- CONDITIONS -------------------------------------------------------

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
 * @see http://hl7.org/fhir/DSTU2/valueset-condition-clinical.html
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of active Conditions, or null if null was passed in
 */
define function Active(CondList List<Condition>):
  CondList C
    where C.clinicalStatus.value = 'active'
      and C.abatementDateTime is null
      and C.abatementQuantity is null
      and C.abatementBoolean.value is not true
      and C.abatementPeriod is null
      and C.abatementRange is null
      and C.abatementString is null

/**
 * Conditions that are confirmed and active.
 * @see Confirmed(List<Condition>)
 * @see Active(List<Condition>)
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of confirmed active Conditions, or null if null was passed in
 */
define function ConfirmedActive(CondList List<Condition>):
  Confirmed(Active(CondList))

/**
 * Indicates if any of the passed in Conditions are confirmed and active.
 * @see ConfirmedActive(List<Condition>)
 * @param CondList - a list of Conditions
 * @returns {System.Boolean} true if a confirmed active condition is found in the list, false otherwise
 */
define function HasConfirmedActive(CondList List<Condition>):
  Exists(ConfirmedActive(CondList))

 // -------------------------------------------------- PROCEDURES ------------------------------------------------------

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
  * Indicates if any of the passed in Procedures have been completed.
  * @see Completed(List<Procedure>)
  * @param ProcList - a list of Procedures
  * @returns {System.Boolean} true if a completed Procedure is found in the list, false otherwise
  */
define function HasCompleted(ProcList List<Procedure>):
  Exists(Completed(ProcList))

/**
 * Procedures that have been completed in a specific "look back" period. For example, Procedures completed in the last
 * 2 weeks.
 * @see Completed(List<Procedure>)
 * @param ProcList - a list of Procedures
 * @param LookBack - the lookback period for when the procedure was performed
 * @returns {List<Procedure>} a list of completed Procedures in the look back period, or null if null was passed in
 */
define function CompletedInLast(ProcList List<Procedure>, LookBack System.Quantity):
  (Completed(ProcList)) P
    let PerformedPeriod: FHIRHelpers.ToInterval(P.performedPeriod)
    where P.performedDateTime.value in Interval[Now() - LookBack, Now()]
      or start of PerformedPeriod in Interval[Now() - LookBack, Now()]
      or end of PerformedPeriod in Interval[Now() - LookBack, Now()]

/**
 * Indicates if any of the passed in procedures have been completed in the specified "look back" period.
 * @see CompletedInLast(List<Procedure>, System.Quantity)
 * @param ProcList - a list of Procedures
 * @param LookBack - the lookback period for when the procedure was performedPeriod
 * @returns {System.Boolean} true if a completed Procedure in the look back period is found in the list, false otherwise
 */
define function HasCompletedInLast(ProcList List<Procedure>, Dur System.Quantity):
  Exists(CompletedInLast(ProcList, Dur))

// -------------------------------------------------- MEDICATIONS ------------------------------------------------------

/**
 * Medications that are active, according to a statement, but not necessarily verified via a prescription.  For example,
 * medications that a patient has self-reported to be taking.  In FHIR DSTU2, this is reflected by MedicationStatement
 * with status 'active', no end date, and no flag indicating it wasn't taken.
 * @see http://hl7.org/fhir/DSTU2/valueset-medication-statement-status.html
 * @param MedList - a list of MedicationStatements
 * @returns {List<MedicationStatement>} a list of active medication statements, or null if null was passed in
 */
define function Active(MedList List<MedicationStatement>):
  MedList M
    where M.status.value = 'active'
      and M.wasNotTaken.value is not true
      and end of FHIRHelpers.ToInterval(M.effectivePeriod) is null

  /**
   * Indicates if any of the passed in MedicationStatements are active.
   * @see Active(List<MedicationStatement>)
   * @param MedList - a list of MedicationStatements
   * @returns {System.Boolean} true if an active MedicationStatement is found in the list, false otherwise
   */
 define function HasActive(MedList List<MedicationStatement>):
   Exists(Active(MedList))

 /**
  * Medications that are active, according to a prescription.  In FHIR DSTU2, this is reflected by MedicationOrder
  * with status 'active'.  There may be other things we should be checking for too.
  * TODO: Consider if there are other ways we should be filtering for active meds via prescription.
  * @see http://hl7.org/fhir/DSTU2/valueset-medication-order-status.html
  * @param MedList - a list of MedicationOrders
  * @returns {List<MedicationOrder>} a list of active medication orders, or null if null was passed in
  */
 define function Active(MedList List<MedicationOrder>):
   MedList M
     where M.status.value = 'active'

   /**
    * Indicates if any of the passed in MedicationOrders represent an active medication.
    * @see Active(List<MedicationOrder>)
    * @param MedList - a list of MedicationOrders
    * @returns {System.Boolean} true if an active MedicationOrder is found in the list, false otherwise
    */
  define function HasActive(MedList List<MedicationOrder>):
    Exists(Active(MedList))
