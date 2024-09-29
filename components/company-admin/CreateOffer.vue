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
          @input="(data) => handleOnInput('duties', data)"
        />
        <span v-if="form.duties.length < 3" class="error-message">{{
          dutiesError
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
          placeholder="Seleccione una opción"
          @select="(data) => handleOnInput('shift', data)"
        />
        <span v-if="form.shift.length < 1" class="error-message">{{
          shiftError
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
      <div class="form-field">
        <CoreDropdown
          :list-options="locationListData"
          label="Ciudad"
          placeholder="Seleccione una ciudad"
          @select="(data) => handleOnInput('location', data)"
        />
        <span v-if="!form.location" class="error-message">{{
          locationError
        }}</span>
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreDropdown
          :list-options="genderListData"
          label="Género"
          placeholder="Seleccione una opción"
          @select="(data) => handleOnInput('gender', data)"
        />
        <span v-if="!form.gender" class="error-message">{{ genderError }}</span>
      </div>
      <div class="form-field">
        <CoreDropdown
          :list-options="ageListData"
          label="Edad"
          placeholder="Seleccione una opción"
          @select="(data) => handleOnInput('age', data)"
        />
        <span v-if="!form.age" class="error-message">{{ ageError }}</span>
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreDropdown
          :list-options="workTypeListData"
          label="Tipo de trabajo"
          placeholder="Seleccione una opción"
          @select="(data) => handleOnInput('work_type', data)"
        />
        <span v-if="!form.work_type" class="error-message">{{
          workTypeError
        }}</span>
      </div>
      <div class="form-field">
        <CoreDropdown
          :list-options="militaryServiceBookListData"
          label="Libreta militar"
          placeholder="Seleccione una opción"
          @select="(data) => handleOnInput('military_service_book', data)"
        />
        <span v-if="!form.military_service_book" class="error-message">{{
          militaryServiceBookError
        }}</span>
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreDropdown
          :list-options="drivingLicenseListData"
          label="Licencia de Conducción"
          placeholder="Seleccione una opción"
          @select="(data) => handleOnInput('driving_license', data)"
        />
        <span v-if="!form.driving_license" class="error-message">{{
          drivingLicenseError
        }}</span>
      </div>
      <div class="form-field">
        <CoreDropdown
          :list-options="disabilityListData"
          label="Discapacidad"
          placeholder="Seleccione una opción"
          @select="(data) => handleOnInput('disability', data)"
        />
        <span v-if="!form.disability" class="error-message">{{
          disabilityError
        }}</span>
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreInput
          id="profesional-experience-id"
          name="number"
          min-length="2"
          label="Experiencia laboral"
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
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreDropdown
          :list-options="educationListData"
          label="Educación Mínima"
          placeholder="Seleccione una opción"
          @select="(data) => handleOnInput('education', data)"
        />
        <span v-if="!form.education" class="error-message">{{
          educationError
        }}</span>
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreDropdown
          :list-options="loadedSkillListData"
          label="Habilidades asociadas al cargo"
          placeholder="Habilidades asociadas al cargo"
          max-height="100px"
          @select="(data) => handleOnInput('loaded_skill', data)"
        />
        <span v-if="form.loaded_skill.length < 1" class="error-message">{{
          loadedSkillsError
        }}</span>
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreDynamicInputFields
          id="skills-list"
          v-model:fields="form.skill"
          label="Habilidades necesarias para un cargo"
          required
          placeholder="Campo de Texto para agregar habilidades específicas o especiales"
        />
      </div>
    </div>
    <div class="form-field">
        <CoreInput
          id="offer-id"
          name="text"
          min-length="2"
          label="Preguntas filtro"
          placeholder=""
          required
          type="text"
          @input="(data) => handleOnInput('questions_filter', data)"
        />
        <span v-if="form.questions_filter.length < 3" class="error-message">{{
          questionsFilterError
        }}</span>
      </div>
    <div class="button">
      <CoreButton
        size="sm"
        label="Crear oferta"
        :disabled="false"
        @click="onCreateOffer"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ageListData } from "~/data/age/age";
import { contractTypeListData } from "~/data/contract-type/contract-type";
import { disabilityListData } from "~/data/disability/disability";
import { drivingLicenseListData } from "~/data/driving-license/driving-license";
import { educationListData } from "~/data/education/education";
import { expertiseAreaListData } from "~/data/expertise-area/expertise-area";
import { genderListData } from "~/data/gender/gender";
import { locationListData } from "~/data/locations/locations";
import { militaryServiceBookListData } from "~/data/military-service-book/military-service-book";
import { shiftListData } from "~/data/shift/shifts";
import { workTypeListData } from "~/data/work-type/work-type";
import { loadedSkillListData } from "~/data/loaded-skills/loaded-skills";

interface ICreateOfferForm {
  offer_name: string;
  duties: string;
  expertise_area: string;
  max_positions: number;
  contract_type: string;
  shift: string;
  range_salary: number[];
  gender: string;
  age: string;
  work_type: string;
  military_service_book: string;
  driving_license: string;
  disability: string;
  location: string;
  education: string;
  loaded_skill: string;
  skill: [''],
  profesional_experience_years: number;
  questions_filter: string;
}
const form = ref<ICreateOfferForm>({
  offer_name: "",
  duties: "",
  expertise_area: "",
  max_positions: 1,
  contract_type: "",
  shift: "",
  range_salary: [0, 0],
  gender: "",
  age: "",
  work_type: "",
  military_service_book: "",
  driving_license: "",
  disability: "",
  location: "",
  education: "",
  loaded_skill: "",
  skill: [''],
  profesional_experience_years: 0,
  questions_filter: "",
});
const offerNameError = ref<string>("");
const dutiesError = ref<string>("");
const expertiseAreaError = ref<string>("");
const maxPositionsError = ref<string>("");
const contractTypeError = ref<string>("");
const shiftError = ref<string>("");
const locationError = ref<string>("");
const genderError = ref<string>("");
const ageError = ref<string>("");
const workTypeError = ref<string>("");
const militaryServiceBookError = ref<string>("");
const drivingLicenseError = ref<string>("");
const disabilityError = ref<string>("");
const educationError = ref<string>("");
const profesionalExperienceError = ref<string>("");
const loadedSkillsError = ref<string>("");
const disableButton = ref<boolean>(true);
const questionsFilterError = ref<string>("");

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
    case "questions_filter":
      questionsFilterError.value = value.length < 3 ? "Inserta un valor válido" : "";
      break;
    case "duties":
      dutiesError.value = value.length < 3 ? "Inserta un valor válido" : "";
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
    case "shift":
      shiftError.value = !value.length ? "Selecciona un opción" : "";
      break;
    case "location":
      locationError.value = !value.length ? "Selecciona una ciudad" : "";
      break;
    case "gender":
      genderError.value = !value.length ? "Selecciona una opción" : "";
      break;
    case "age":
      ageError.value = !value.length ? "Selecciona una opción" : "";
      break;
    case "work_type":
      workTypeError.value = !value.length ? "Selecciona una opción" : "";
      break;
    case "military_service_book":
      militaryServiceBookError.value = !value.length
        ? "Selecciona una opción"
        : "";
      break;
    case "driving_license":
      drivingLicenseError.value = !value.length ? "Selecciona una opción" : "";
      break;
    case "disability":
      disabilityError.value = !value.length ? "Selecciona una opción" : "";
      break;
    case "education":
      educationError.value = !value.length ? "Selecciona una opción" : "";
      break;
    case "profesional_experience_years":
      profesionalExperienceError.value =
        isNaN(Number(value)) || Number(value) === 0
          ? "Inserta un valor válido"
          : "";
      break;
    case "loaded_skill":
      loadedSkillsError.value = !value.length ? "Selecciona una opción" : "";
      break;
    default:
      break;
  }
};
const validateForm = (): void => {
  const isOfferNameValid =
    form.value.offer_name.length >= 3 && offerNameError.value === "";
  const isQuestionsFilterValid =
    form.value.questions_filter.length >= 3 && questionsFilterError.value === "";
  const isDutiesValid =
    form.value.duties.length >= 3 && dutiesError.value === "";
  const isExpertiseAreaValid =
    form.value.expertise_area && expertiseAreaError.value === "";
  const isMaxPositionsValid =
    !isNaN(Number(form.value.max_positions)) &&
    Number(form.value.max_positions) >= 1 &&
    maxPositionsError.value === "";
  const isContractTypeValid =
    form.value.contract_type && contractTypeError.value === "";
  const isShiftValid = form.value.shift && shiftError.value === "";
  const isLocationValid = form.value.location && locationError.value === "";
  const isGenderValid = form.value.gender && genderError.value === "";
  const isAgeValid = form.value.age && ageError.value === "";
  const isWorkTypeValid = form.value.work_type && workTypeError.value === "";
  const isMilitaryServiceBookValid =
    form.value.military_service_book && militaryServiceBookError.value === "";
  const isDrivingLicenseValid =
    form.value.driving_license && drivingLicenseError.value === "";
  const isDisabilityValid =
    form.value.disability && disabilityError.value === "";
  const isEducationValid = form.value.education && educationError.value === "";

  const isProfessionalExperienceValid =
    !isNaN(Number(form.value.profesional_experience_years)) &&
    Number(form.value.profesional_experience_years) > 0 &&
    profesionalExperienceError.value === "";
  const isLoadedSkillValid =
    form.value.loaded_skill && loadedSkillsError.value === "";

  disableButton.value = !(
    isOfferNameValid &&
    isDutiesValid &&
    isExpertiseAreaValid &&
    isMaxPositionsValid &&
    isContractTypeValid &&
    isShiftValid &&
    isLocationValid &&
    isGenderValid &&
    isAgeValid &&
    isWorkTypeValid &&
    isMilitaryServiceBookValid &&
    isDrivingLicenseValid &&
    isDisabilityValid &&
    isEducationValid &&
    isProfessionalExperienceValid &&
    isLoadedSkillValid &&
    isQuestionsFilterValid
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
