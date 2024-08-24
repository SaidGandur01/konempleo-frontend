<template>
  <div class="create-offer">
    <h2>Crear Oferta</h2>
    <div class="form-group">
      <div class="form-field">
        <CoreInput
          id="offer-id"
          name="text"
          min-length="2"
          label="Nombre de la oferta"
          placeholder="Nombre de la oferta"
          required
          type="text"
          @input="(data) => handleOnInput('offer_name', data)"
        />
        <span v-if="form.offer_name.length < 3" class="error-message">{{
          offerNameError
        }}</span>
      </div>
      <div class="form-field">
        <CoreInput
          id="offer-functions-id"
          name="functions"
          min-length="2"
          label="Funciones"
          placeholder="Funciones"
          required
          type="text"
          @input="(data) => handleOnInput('offer_functions', data)"
        />
        <span v-if="form.offer_functions.length < 3" class="error-message">{{
          offerFunctionsError
        }}</span>
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreDropdown
          :list-options="expertiseAreaListData"
          label="Área de Experiencia"
          placeholder="Seleccione un área"
          @select="(data) => handleOnInput('expertise_area', data)"
        />
        <span v-if="!form.expertise_area" class="error-message">{{
          expertiseAreaError
        }}</span>
      </div>
      <div class="form-field">
        <CoreInput
          id="position-availables-id"
          name="number"
          min-length="2"
          label="Número de puestos disponibles"
          required
          type="number"
          :value="1"
          @input="(data) => handleOnInput('max_positions', data)"
        />
        <span v-if="form.max_positions < 1" class="error-message">{{
          maxPositionsError
        }}</span>
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreDropdown
          :list-options="contractTypeListData"
          label="Tipo de contrato"
          placeholder="Seleccione un tipo de contrato"
          @select="(data) => handleOnInput('contract_type', data)"
        />
        <span v-if="!form.contract_type" class="error-message">{{
          contractTypeError
        }}</span>
      </div>
      <div class="form-field">
        <CoreDropdown
          :list-options="shiftListData"
          label="Horario"
          placeholder="Seleccione un opción"
          @select="(data) => handleOnInput('shift', data)"
        />
        <span v-if="form.shift.length < 1" class="error-message">{{
          shiftError
        }}</span>
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreDropdown
          :list-options="locationListData"
          label="Ubicación"
          placeholder="Seleccione una ciudad"
          @select="(data) => handleOnInput('location', data)"
        />
        <span v-if="!form.location" class="error-message">{{
          locationError
        }}</span>
      </div>
      <div class="form-field">
        <CoreDropdown
          :list-options="positionListData"
          label="Cargo"
          placeholder="Seleccione un cargo"
          @select="(data) => handleOnInput('position', data)"
        />
        <span v-if="!form.position" class="error-message">{{
          positionError
        }}</span>
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreDropdown
          :list-options="educationListData"
          label="Educación Mínima"
          placeholder="Seleccione un opción"
          @select="(data) => handleOnInput('education', data)"
        />
        <span v-if="!form.education" class="error-message">{{
          educationError
        }}</span>
      </div>
      <div class="form-field">
        <CoreDropdown
          :list-options="genderListData"
          label="Género"
          placeholder="Seleccione un opción"
          @select="(data) => handleOnInput('gender', data)"
        />
        <span v-if="!form.gender" class="error-message">{{ genderError }}</span>
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreInput
          id="profesional-experience-id"
          name="number"
          min-length="2"
          label="Experiencia laboral (Años)"
          required
          type="number"
          :value="0"
          @input="(data) => handleOnInput('profesional_experience_years', data)"
        />
        <span
          v-if="form.profesional_experience_years < 1"
          class="error-message"
          >{{ profesionalExperienceError }}</span
        >
      </div>
      <div class="form-field">
        <CoreDropdown
          :list-options="workConditionsListData"
          label="Condición laboral"
          placeholder="Seleccione un opción"
          @select="(data) => handleOnInput('work_condition', data)"
        />
        <span v-if="!form.work_condition" class="error-message">{{
          workConditionError
        }}</span>
      </div>
      <div class="form-field">
        <CoreInput
          id="work-duration-average-id"
          name="number"
          min-length="2"
          label="Duración promedio en los trabajos (Meses)"
          required
          type="number"
          :value="0"
          @input="(data) => handleOnInput('work_duration_average', data)"
        />
        <span v-if="form.work_duration_average < 1" class="error-message">{{
          workDurationAverageError
        }}</span>
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreRangeSlider
          label="Rango salarial"
          @drag-end="onHandleRangeSelection"
        />
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreDropdown
          :list-options="skillListData"
          label="Habilidades"
          placeholder="Habilidades necesarias para un cargo"
          max-height="100px"
          @select="(data) => handleOnInput('skill', data)"
        />
        <span v-if="form.skill.length < 1" class="error-message">{{
          skillError
        }}</span>
      </div>
    </div>
    <div class="button">
      <CoreButton
        size="sm"
        label="Guardar"
        :disabled="false"
        @click="onCreateOffer"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { contractTypeListData } from "~/data/contract-type/contract-type";
import { educationListData } from "~/data/education/education";
import { expertiseAreaListData } from "~/data/expertise-area/expertise-area";
import { genderListData } from "~/data/gender/gender";
import { locationListData } from "~/data/locations/locations";
import { positionListData } from "~/data/positions/positions";
import { shiftListData } from "~/data/shift/shifts";
import { skillListData } from "~/data/skills/skills";
import { workConditionsListData } from "~/data/work-conditions/work-conditions";

interface ICreateOfferForm {
  offer_name: string;
  offer_functions: string;
  expertise_area: string;
  max_positions: number;
  contract_type: string;
  shift: string;
  location: string;
  position: string;
  education: string;
  gender: string;
  skill: string;
  profesional_experience_years: number;
  range_salary: number[];
  work_condition: string;
  work_duration_average: number;
}
const form = ref<ICreateOfferForm>({
  offer_name: "",
  offer_functions: "",
  expertise_area: "",
  max_positions: 1,
  contract_type: "",
  shift: "",
  location: "",
  position: "",
  education: "",
  gender: "",
  skill: "",
  profesional_experience_years: 0,
  range_salary: [0, 0],
  work_condition: "",
  work_duration_average: 0,
});
const offerNameError = ref<string>("");
const offerFunctionsError = ref<string>("");
const expertiseAreaError = ref<string>("");
const maxPositionsError = ref<string>("");
const contractTypeError = ref<string>("");
const shiftError = ref<string>("");
const locationError = ref<string>("");
const positionError = ref<string>("");
const educationError = ref<string>("");
const genderError = ref<string>("");
const profesionalExperienceError = ref<string>("");
const workConditionError = ref<string>("");
const workDurationAverageError = ref<string>("");
const skillError = ref<string>("");
const disableButton = ref<boolean>(true);

const onHandleRangeSelection = (data: { min: number; max: number }): void => {
  form.value = {
    ...form.value,
    range_salary: [data.min, data.max],
  };
};

const handleOnInput = (keyField: string, value: string): void => {
  form.value = {
    ...form.value,
    [keyField]: value,
  };
  validateErrorsForm(keyField, value);
  validateForm();
};
const validateErrorsForm = (keyField: string, value: string): void => {
  switch (keyField) {
    case "offer_name":
      offerNameError.value = value.length < 3 ? "Inserta un nombre válido" : "";
      break;
    case "offer_functions":
      offerFunctionsError.value =
        value.length < 3 ? "Inserta un valor válido" : "";
      break;
    case "expertise_area":
      expertiseAreaError.value = !value.length ? "Selecciona un área" : "";
      break;
    case "max_positions":
      maxPositionsError.value =
        isNaN(Number(value)) || Number(value) < 1
          ? "Inserta un valor válido"
          : "";
      break;
    case "contract_type":
      contractTypeError.value = !value.length
        ? "Seleccione un tipo de contrato"
        : "";
      break;
    case "location":
      locationError.value = !value.length ? "Selecciona una ciudad" : "";
      break;
    case "position":
      positionError.value = !value.length ? "Selecciona un cargo" : "";
      break;
    case "education":
      educationError.value = !value.length ? "Selecciona un opción" : "";
      break;
    case "gender":
      genderError.value = !value.length ? "Selecciona un opción" : "";
      break;
    case "profesional_experience_years":
      profesionalExperienceError.value =
        isNaN(Number(value)) || Number(value) === 0
          ? "Inserta un valor válido"
          : "";
      break;
    case "work_condition":
      workConditionError.value = !value.length ? "Selecciona un opción" : "";
      break;
    case "work_duration_average":
      workDurationAverageError.value =
        isNaN(Number(value)) || Number(value) === 0
          ? "Inserta un valor válido"
          : "";
      break;
    case "shift":
      shiftError.value = !value.length ? "Selecciona un opción" : "";
      break;
    case "skill":
      skillError.value = !value.length ? "Selecciona un opción" : "";
      break;
    default:
      break;
  }
};
const validateForm = (): void => {
  const isOfferNameValid =
    form.value.offer_name.length >= 3 && offerNameError.value === "";
  const isOfferFunctionsValid =
    form.value.offer_functions.length >= 3 && offerFunctionsError.value === "";
  const isExpertiseAreaValid =
    form.value.expertise_area && expertiseAreaError.value === "";
  const isMaxPositionsValid =
    !isNaN(Number(form.value.max_positions)) &&
    Number(form.value.max_positions) >= 1 &&
    maxPositionsError.value === "";
  const isContractTypeValid =
    form.value.contract_type && contractTypeError.value === "";
  const isLocationValid = form.value.location && locationError.value === "";
  const isPositionValid = form.value.position && positionError.value === "";
  const isEducationValid = form.value.education && educationError.value === "";
  const isGenderValid = form.value.gender && genderError.value === "";

  const isProfessionalExperienceValid =
    !isNaN(Number(form.value.profesional_experience_years)) &&
    Number(form.value.profesional_experience_years) > 0 &&
    profesionalExperienceError.value === "";
  const isWorkConditionValid =
    form.value.work_condition && workConditionError.value === "";
  const isWorkDurationAverageValid =
    !isNaN(Number(form.value.work_duration_average)) &&
    Number(form.value.work_duration_average) > 0 &&
    workDurationAverageError.value === "";
  const isShiftValid = form.value.shift && shiftError.value === "";
  const isSkillValid = form.value.skill && skillError.value === "";

  disableButton.value = !(
    isOfferNameValid &&
    isOfferFunctionsValid &&
    isExpertiseAreaValid &&
    isMaxPositionsValid &&
    isContractTypeValid &&
    isLocationValid &&
    isPositionValid &&
    isEducationValid &&
    isGenderValid &&
    isProfessionalExperienceValid &&
    isWorkConditionValid &&
    isWorkDurationAverageValid &&
    isShiftValid &&
    isSkillValid
  );
};
const onCreateOffer = async (): Promise<void> => {
  console.log(form.value);
};
</script>
<style lang="scss" scoped>
.create-offer {
  border: 1px solid #d1d5dc;
  border-radius: 1rem;
  background-color: var(--background-color-secondary);
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
  padding: 2rem;
  width: 100%;

  h2 {
    font-size: 1.7rem;
  }

  .form-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 3rem;
  }
}
</style>
