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
          :should-emit-id="true"
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
          :should-emit-id="true"
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
          :min-value="minSalary"
          :max-value="10000000"
          :max-initial-value="maxSalary"
          :multiplier="100000"
          :is-currency="true"
          @drag-end="(data) => onHandleSalarySelection(data as IRange)"
        />
      </div>
      <div class="form-field">
        <CoreDropdown
          :list-options="cityListData"
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
          :should-emit-id="true"
          @select="(data) => handleOnInput('gender', data)"
        />
        <span v-if="!form.gender" class="error-message">{{ genderError }}</span>
      </div>
      <div class="form-field">
        <CoreRangeSlider
          label="Edad"
          :min-value="minAge"
          :max-value="100"
          :multiplier="1"
          :single-slide="true"
          @drag-end="(data) => handleOnAgeSelection(data as number)"
        />
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
          :should-emit-id="true"
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
          :multiple-select="true"
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
        <CoreDropdown
          :list-options="workExperienceData"
          label="Experiencia laboral"
          placeholder="Seleccione una opción"
          @select="
            (data) => handleOnInput('profesional_experience_years', data)
          "
        />
        <span v-if="!form.profesional_experience_years" class="error-message">{{
          profesionalExperienceError
        }}</span>
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreDropdown
          :list-options="educationListData"
          label="Educación Mínima"
          placeholder="Seleccione una opción"
          :should-emit-id="true"
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
          :list-options="cargos"
          label="Cargo"
          placeholder="Seleccione el cargo"
          :should-emit-id="true"
          :should-show-search-bar="true"
          @select="(data) => handleOnInput('cargo', data)"
        />
        <span v-if="form.cargo.length < 1" class="error-message">{{
          cargoError
        }}</span>
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreDynamicInputFields
          id="skills-list"
          v-model:fields="form.skill"
          :initial-fields="skills"
          label="Habilidades necesarias para un cargo"
          required
          placeholder="Campo de Texto para agregar habilidades específicas o especiales"
          :add-skill-callback="(data) => onNewSkill(data)"
          :disable-input="!currentCargoId"
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
        :disabled="disableButton"
        @click="onCreateOffer"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { workExperienceData } from "~/data/experience-years/experience-years";
import { contractTypeListData } from "~/data/contract-type/contract-type";
import { disabilityListData } from "~/data/disability/disability";
import { drivingLicenseListData } from "~/data/driving-license/driving-license";
import { educationListData } from "~/data/education/education";
import { expertiseAreaListData } from "~/data/expertise-area/expertise-area";
import { genderListData } from "~/data/gender/gender";
import { cityListData } from "~/data/city/city";
import { militaryServiceBookListData } from "~/data/military-service-book/military-service-book";
import { shiftListData } from "~/data/shift/shifts";
import { workTypeListData } from "~/data/work-type/work-type";
import { useUserStore } from "~/store/user.store";
import { useHelperStore } from "~/store/helper.store";
import type { IListOptions } from "../core/dropdown.vue";
import { formatSalary } from "~/utils/helpers/common";
import type { IRange } from "../core/RangeSlider.vue";

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
  cargo: string;
  skill: IListOptions[];
  profesional_experience_years: string;
  questions_filter: string;
}
const minSalary = 1423500;
const maxSalary = 4000000;
const minAge = 18;

const form = ref<ICreateOfferForm>({
  offer_name: "",
  duties: "",
  expertise_area: "",
  max_positions: 1,
  contract_type: "",
  shift: "",
  range_salary: [minSalary, maxSalary],
  gender: "",
  age: `${minAge}`,
  work_type: "",
  military_service_book: "",
  driving_license: "",
  disability: "",
  location: "",
  education: "",
  cargo: "",
  skill: [{ key: "", value: "" }],
  profesional_experience_years: "",
  questions_filter: "",
});
const { $toast } = useNuxtApp();
const helperStore = useHelperStore();
const userStore = useUserStore();
const token = userStore.getToken();
const offerNameError = ref<string>("");
const dutiesError = ref<string>("");
const expertiseAreaError = ref<string>("");
const maxPositionsError = ref<string>("");
const contractTypeError = ref<string>("");
const shiftError = ref<string>("");
const locationError = ref<string>("");
const genderError = ref<string>("");
const workTypeError = ref<string>("");
const militaryServiceBookError = ref<string>("");
const drivingLicenseError = ref<string>("");
const disabilityError = ref<string>("");
const educationError = ref<string>("");
const profesionalExperienceError = ref<string>("");
const cargoError = ref<string>("");
const disableButton = ref<boolean>(true);
const questionsFilterError = ref<string>("");
const cargos = ref([]);
const skills = ref([]);
const currentCargoId = ref<number>();

const onHandleSalarySelection = (data: { min: number; max: number }): void => {
  form.value = {
    ...form.value,
    range_salary: [data.min, data.max],
  };
};

const handleOnAgeSelection = (data: number): void => {
  form.value = {
    ...form.value,
    age: data.toString(),
  };
};

const onNewSkill = async (skill: string) => {
  const payload = {
    cargoId: currentCargoId.value,
    skills: [skill],
  };
  const params: fetchWrapperProps = {
    method: EFetchMethods.POST,
    path: `skills/`,
    body: payload,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong creating new Skill for this cargo",
    });
  } else {
    helperStore.renderToastMessage($toast, false, {
      success: "Skill creada exitosamente",
    });
    console.log(data);
    await fetchCargoSkills(currentCargoId.value as number);
  }
};

const handleOnInput = (keyField: string, value: string | string[]): void => {
  form.value = {
    ...form.value,
    [keyField]: value,
  };
  validateErrorsForm(keyField, value);
  validateForm();
  if (keyField === "cargo") currentCargoId.value = Number(value);
};

const validateErrorsForm = (
  keyField: string,
  value: string | string[]
): void => {
  switch (keyField) {
    case "offer_name":
      offerNameError.value = value.length < 3 ? "Inserta un nombre válido" : "";
      break;
    case "questions_filter":
      questionsFilterError.value =
        value.length < 3 ? "Inserta un valor válido" : "";
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
      profesionalExperienceError.value = !value.length
        ? "Selecciona una opción"
        : "";
      break;
    case "cargo":
      cargoError.value = !value.length ? "Selecciona una opción" : "";
      break;
    default:
      break;
  }
};

const validateForm = (): void => {
  const isOfferNameValid =
    form.value.offer_name.length >= 3 && offerNameError.value === "";
  const isQuestionsFilterValid =
    form.value.questions_filter.length >= 3 &&
    questionsFilterError.value === "";
  const isDutiesValid =
    form.value.duties.length >= 3 && dutiesError.value === "";
  const isExpertiseAreaValid =
    form.value.expertise_area && expertiseAreaError.value === "";
  const isMaxPositionsValid =
    !isNaN(Number(form.value.max_positions)) &&
    Number(form.value.max_positions) > 0 &&
    maxPositionsError.value === "";
  const isContractTypeValid =
    form.value.contract_type && contractTypeError.value === "";
  const isShiftValid = form.value.shift && shiftError.value === "";
  const isLocationValid = form.value.location && locationError.value === "";
  const isGenderValid = form.value.gender && genderError.value === "";
  const isWorkTypeValid = form.value.work_type && workTypeError.value === "";
  const isMilitaryServiceBookValid =
    form.value.military_service_book && militaryServiceBookError.value === "";
  const isDrivingLicenseValid =
    form.value.driving_license && drivingLicenseError.value === "";
  const isDisabilityValid =
    form.value.disability && disabilityError.value === "";
  const isEducationValid = form.value.education && educationError.value === "";
  const isProfessionalExperienceValid =
    form.value.profesional_experience_years &&
    profesionalExperienceError.value === "";
  const isCargoValid = form.value.cargo && cargoError.value === "";

  disableButton.value = !(
    isOfferNameValid &&
    isDutiesValid &&
    isExpertiseAreaValid &&
    isMaxPositionsValid &&
    isContractTypeValid &&
    isShiftValid &&
    isLocationValid &&
    isGenderValid &&
    isWorkTypeValid &&
    isMilitaryServiceBookValid &&
    isDrivingLicenseValid &&
    isDisabilityValid &&
    isEducationValid &&
    isProfessionalExperienceValid &&
    isCargoValid &&
    isQuestionsFilterValid
  );
};

const fetchUserData = async () => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `users/me`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing User data",
    });
    return { myData: null, error: true };
  } else {
    return { myData: data.value, error: null };
  }
};

const onCreateOffer = async (): Promise<void> => {
  const { myData, error: userDataError } = await fetchUserData();
  if (!userDataError) {
    const getPayload = (data: any) => {
      const mapSkills = data.skill.map((skill: IListOptions) => {
        const skillId = skill.key;
        return skillId;
      });

      return {
        offer_in: {
          name: data.offer_name,
          duties: data.duties,
          exp_area: data.expertise_area,
          vacants: data.max_positions,
          contract_type: Number(data.contract_type),
          salary: formatSalary(data.range_salary.join()),
          city: data.location,
          shift: data.shift,
          gender: data.gender,
          military_notebook: data.military_service_book,
          age: data.age,
          job_type: data.work_type,
          license: data.driving_license,
          disabled: data.disability === "SI" ? true : false,
          experience_years: data.profesional_experience_years,
          filter_questions: data.questions_filter,
          ed_required: data.education,
          cargoId: data.cargo,
          assigned_cvs: 50,
          companyId: myData.companies[0].id,
        },
        skills: mapSkills,
      };
    };
    const payload = getPayload(form.value);
    const params: fetchWrapperProps = {
      method: EFetchMethods.POST,
      path: "offers/",
      body: payload,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data, error } = await useFetchWrapper(params);
    if (error.value) {
      helperStore.renderToastMessage($toast, true, {
        error: "something went wrong creating Offer",
      });
    } else {
      const response = data.value;
      helperStore.renderToastMessage($toast, false, {
        success: "Offer creada exitosamente",
      });
      setTimeout(() => {
        navigateTo("/company-admin/offers");
      }, 1500);
      console.log(response);
    }
  }
};

const fetchCargoSkills = async (id: number) => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `skills/cargo/${id}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing Skills data for this cargo",
    });
    skills.value = [];
  } else {
    const mappedSkills = data.value.skills.reduce((acc, item) => {
      acc.push({ key: item.id, value: item.name });
      return acc;
    }, []);
    skills.value = mappedSkills;
  }
};

onMounted(async () => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: "cargo/",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing Cargos data",
    });
    cargos.value = [];
  } else {
    const mappedCargos = data.value.reduce((acc, item) => {
      acc.push({ key: item.id, value: item.name });
      return acc;
    }, []);
    cargos.value = mappedCargos;
  }
});

watch(currentCargoId, async (newValue) => {
  if (newValue) {
    await fetchCargoSkills(newValue);
  }
});
</script>
<style lang="scss" scoped>
.create-offer {
  background-color: var(--background-color-secondary);
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
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
