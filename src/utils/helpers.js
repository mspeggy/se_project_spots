export function setButtonText(btn, isLoading, defaultText = "Save", loadingText = "Saving...") {
    if (!btn) return;

    if (isLoading) {
         if (!btn.dataset.originalText) {
      btn.dataset.originalText = btn.textContent;
    }
        //set the loading text
        btn.textContent = loadingText;
    
    } else { //set not loading text
        btn.textContent = btn.dataset.originalText || defaultText;
    btn.disabled = false; 
  }
}
       
    
