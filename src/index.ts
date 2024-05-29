import EvenBetterAPI from "@bebiks/evenbetter-api";
import type { Caido } from "@caido/sdk-frontend";

const Commands = {
  HttpQLQuickQuery: "my-plugin.HttpQLQuickQuery",
} as const;

const HttpQLQuickQuery = (caido: Caido, http_type: string) => { 
  const hightlighted_text = caido.window.getActiveEditor()?.getSelectedText().replace(/"/g, '\\"');
  const searchBox = document.querySelector('.cm-content[contenteditable="true"]');
  if (!searchBox) return;
  if (http_type === "request") {
    searchBox.textContent = `req.raw.cont:"${hightlighted_text}"`
  } else {
    searchBox.textContent = `resp.raw.cont:"${hightlighted_text}"`
  }

};


// Thanks for the code Riddle
function addPopupItem(label: string, callback) {
  const popupMenu = document.querySelector(".p-contextmenu-root-list");
  if (popupMenu) {
  const newItem = document.createElement("li");
  newItem.id = `pv_id_1_${popupMenu.children.length}`;
  newItem.className = "p-menuitem";
  newItem.setAttribute("role", "menuitem");
  newItem.setAttribute("aria-label", label);
  newItem.setAttribute("aria-level", "1");
  newItem.setAttribute("aria-setsize", popupMenu.children.length + 1);
  newItem.setAttribute("aria-posinset", popupMenu.children.length);
  newItem.setAttribute("data-pc-section", "menuitem");
  newItem.setAttribute("data-p-highlight", "false");
  newItem.setAttribute("data-p-focused", "false");
  newItem.innerHTML = `
      <div class="p-menuitem-content" data-pc-section="content">
          <div data-v-25e37fb9 class="c-context-menu__item">
              <div class="c-context-menu__content">${label}</div>
              <div class="c-context-menu__trailing-visual"></div>
          </div>
      </div>
  `;
  newItem.addEventListener("click", function () {
      callback();
      closePopupMenu();
  });
  popupMenu.appendChild(newItem);
  }
}
// Thanks for the code Riddle
function closePopupMenu() {
  const popupMenu = document.querySelector(".p-contextmenu");
  if (popupMenu) {
      popupMenu.style.display = "none";
  }
}

export const init = (caido: Caido) => {

  let http_type: string = "null";

  caido.commands.register(Commands.HttpQLQuickQuery, {
    name: "HTTPQL Quick Query",
    run: () => HttpQLQuickQuery(caido, http_type),
  });


  EvenBetterAPI.eventManager.on("onContextMenuOpen", (data) => {
    if (window.location.hash !== "#/intercept") return;
    const request_div = document.querySelector(".c-request");
    if (request_div) {
      request_div.addEventListener("click", () => {
        http_type = "request";
    });
  }

  const response_div = document.querySelector(".c-response");
  if (response_div) {
    response_div.addEventListener("click", () => {
      http_type = "response";
  });
}
    

  addPopupItem("HTTPQL Quick Query", async () => {
    if (http_type === "null") return;
      HttpQLQuickQuery(caido, http_type);
    });
  });

}

