(function () {
  // 打开弹窗
  document.querySelectorAll("[data-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-modal");
      var modal = document.getElementById("modal-" + target);
      if (modal) {
        modal.classList.add("show");
      }
    });
  });

  // 关闭弹窗：点击关闭按钮 / 取消按钮 / 遮罩
  function bindClose(modal) {
    modal.addEventListener("click", function (e) {
      if (
        e.target === modal ||
        e.target.hasAttribute("data-close") ||
        e.target.closest("[data-close]")
      ) {
        modal.classList.remove("show");
      }
    });
  }

  document.querySelectorAll(".modal-mask").forEach(bindClose);

  // Esc 关闭
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-mask.show").forEach(function (m) {
        m.classList.remove("show");
      });
    }
  });

  // 编辑功能
  document.addEventListener("click", function (e) {
    var editIcon = e.target.closest(".edit-icon");
    if (editIcon) {
      var item = editIcon.parentElement;
      var textValue = item.querySelector(".text-value");
      var editInput = item.querySelector(".edit-input");
      var editSelect = item.querySelector(".edit-select");

      if (textValue) {
        textValue.style.display = "none";
      }
      if (editInput) {
        editInput.style.display = "inline-flex";
        editInput.focus();
      }
      if (editSelect) {
        editSelect.style.display = "inline-flex";
        editSelect.focus();
      }
      editIcon.style.display = "none";
    }

    var activeInput = document.querySelector(".edit-input:focus, .edit-select:focus");
    if (!activeInput && !e.target.closest(".editable-item")) {
      document.querySelectorAll(".editable-item").forEach(function (item) {
        var textValue = item.querySelector(".text-value");
        var editInput = item.querySelector(".edit-input");
        var editSelect = item.querySelector(".edit-select");
        var editIcon = item.querySelector(".edit-icon");

        if (editInput && editInput.style.display !== "none") {
          textValue.textContent = editInput.value;
          textValue.style.display = "inline-flex";
          editInput.style.display = "none";
          editIcon.style.display = "inline-flex";
        }
        if (editSelect && editSelect.style.display !== "none") {
          textValue.textContent = editSelect.options[editSelect.selectedIndex].text;
          textValue.style.display = "inline-flex";
          editSelect.style.display = "none";
          editIcon.style.display = "inline-flex";
        }
      });
    }
  });

  // Enter 保存
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var activeInput = document.querySelector(".edit-input:focus, .edit-select:focus");
      if (activeInput) {
        var item = activeInput.parentElement;
        var textValue = item.querySelector(".text-value");
        var editIcon = item.querySelector(".edit-icon");

        if (activeInput.tagName === "INPUT") {
          textValue.textContent = activeInput.value;
        } else if (activeInput.tagName === "SELECT") {
          textValue.textContent = activeInput.options[activeInput.selectedIndex].text;
        }

        textValue.style.display = "inline-flex";
        activeInput.style.display = "none";
        editIcon.style.display = "inline-flex";
      }
    }
  });
})();
