
const dialog = (props) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog-root", "active");
  dialog.innerHTML = `
    <div class="dialog-container">
   
        <div class="dialog-header">
          <h2 class="headline-small dialog-title text-on-surface">
           ${props.title}
          </h2>
          <button class="icon-btn" data-dialog-toggler>
          <span class="material-symbols-rounded" aria-hidden="true">close</span>
              <div class="state-layer"></div>
            </button>
        </div>

    
        <div class="dialog-content">
          <div class="body-medium dialog-text-content text-on-surface-variant">
             ${props.content}
          </div>
        </div>

        <div class="dialog-actions">
          <a href="/login" class="btn btn-text" data-dialog-toggler>
            <p class="label-large">Login</p>
            <div class="state-layer"></div>
          </a>

           <a href="/register" class="btn btn-fill" data-dialog-toggler>
             <p class="label-large">Create account</p>
            <div class="state-layer"></div></a>
           
          </a>
        </div>
      </div>
  <div class="dialog-backdrop" data-dialog-toggler> </div>

    `;
  

  return dialog
};

export default dialog;