import { writable } from 'svelte/store';

// Retrieve initial value from localStorage or default to true
const storedValue = localStorage.getItem('udl_show_considerations');
const initialValue = storedValue === null ? true : storedValue === 'true';

export const showConsiderations = writable(initialValue);

// Persist changes to localStorage
showConsiderations.subscribe((value) => {
  localStorage.setItem('udl_show_considerations', value.toString());
});
