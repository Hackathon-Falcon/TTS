document.addEventListener('DOMContentLoaded', function () {
    // Retrieve elements from the DOM
    const selectElement = document.getElementById('characters');
    const checkboxElement = document.getElementById('character');
    const statusElement = document.getElementById('status');
    const saveButton = document.getElementById('save');
  
    // Load saved options from storage (assuming the presence of a function called loadOptions)
    function loadOptions() {
      // Load saved character value
      const savedCharacter = localStorage.getItem('selectedCharacter');
      if (savedCharacter) {
        selectElement.value = savedCharacter;
      }
  
      // Load saved character checkbox status
      const isChecked = localStorage.getItem('characterChecked');
      if (isChecked === 'true') {
        checkboxElement.checked = true;
      }
    }
  
    // Save options to storage (assuming the presence of a function called saveOptions)
    function saveOptions() {
      // Save selected character
      const selectedCharacter = selectElement.value;
      localStorage.setItem('selectedCharacter', selectedCharacter);
  
      // Save character checkbox status
      const isCharacterChecked = checkboxElement.checked;
      localStorage.setItem('characterChecked', isCharacterChecked);
      statusElement.textContent = 'Options saved!';
    }
  
    // Load options when the page is loaded
    loadOptions();
  
    // Save options when the "Save" button is clicked
    saveButton.addEventListener('click', saveOptions);
  });
  