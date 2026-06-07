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
})();
