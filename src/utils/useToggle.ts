import { ref } from "vue";

const useToggle = (initVal = false) => {
  const val = ref(initVal);
  const toggle = () => {
    val.value = !val.value;
  };
  const set = (newVal: boolean) => {
    val.value = newVal;
  };
  return { val, set, toggle };
};

export default useToggle;
