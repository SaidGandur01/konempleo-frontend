<template>
  <div class="company-content">
    <div class="add-skills-container">
      <div class="add-skills box-shadow-2xl">
        <h2>Añadir habilidades</h2>
        <div class="form-field">
          <CoreDropdown
            :list-options="positionList"
            label="Cargo"
            placeholder="Seleccione un cargo"
            @select="onPositionSelect"
          />
          <span v-if="form.position.length < 1" class="error-message">{{
            positionError
          }}</span>
        </div>
        <div class="form-field">
          <CoreInput
            id="skills-id"
            name="skill"
            min-length="2"
            label="Habilidades"
            placeholder="Coloque las habilidades separándolas por comas ',' Ejemplo: Conductor, tractomulas, Certificación C3"
            required
            type="text"
            @input="(data) => handleOnInput('skills', data)"
          />
          <span v-if="form.skills.length < 3" class="error-message">{{
            skillsError
          }}</span>
        </div>
        <div class="button">
          <CoreButton
            size="sm"
            label="Crear cargo"
            :disabled="disableButton"
            @click="onCreatePosition"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { positionListData } from '~/data/positions/positions';

interface ICreatePositionForm {
  position: string;
  skills: string[];
}
const form = ref<ICreatePositionForm>({
  position: "",
  skills: [],
});
const positionError = ref<string>("");
const skillsError = ref<string>("");
const disableButton = ref<boolean>(true);
const positionList: { key: string; value: string }[] = positionListData;

const onPositionSelect = (value: string): void => {
  handleOnInput("position", value);
};

const handleOnInput = (keyField: string, value: string): void => {
  const currentValue =
    keyField === "position"
      ? value
      : value.split(",").map((skill: string) => skill.trim());

  form.value = {
    ...form.value,
    [keyField]: currentValue,
  };
  validateErrorsForm(keyField, currentValue);
  validateForm();
};

const validateErrorsForm = (
  keyField: string,
  value: string | string[]
): void => {
  switch (keyField) {
    case "position":
      positionError.value = value.length < 1 ? "Inserta un cargo válidos" : "";
      break;
    case "skills":
      skillsError.value =
        value && value[0].length < 3 ? "Agrega al menos una habilidad" : "";
      break;
    default:
      break;
  }
};

const validateForm = (): void => {
  const isPositionValid =
    form.value.position.length >= 1 && positionError.value === "";
  const areSkillsValid =
    form.value.skills.length > 0 &&
    form.value.skills.every((skill) => skill.length >= 3) &&
    skillsError.value === "";
  disableButton.value = !(isPositionValid && areSkillsValid);
};

const onCreatePosition = async (): Promise<void> => {
  const payload: { position: string; skills: string[] } = {
    position: form.value.position,
    skills: form.value.skills,
  };

  console.log(payload);
};
</script>
<style lang="scss" scoped>
.company-content {
  display: flex;

  .add-skills-container {
    flex: 1;
    padding: 5rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 2rem;
    background-color: var(--background-color-primary);

    .add-skills {
      width: 100%;
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
      gap: 3rem;
      padding: 2rem;
      background-color: var(--background-color-secondary);
    
      h2 {
        font-size: 1.7rem;
      }
    }
  }

}
</style>
