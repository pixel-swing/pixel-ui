<template>
  <docs-component
    docs-file-name="<!--DOCS_FILE_NAME-->"
    relative-url="<!--URL-->"
    title="<!--TITLE_SLOT-->"
    code="<!--CODE_SLOT-->"
  >
    <template #title>
      <!--TITLE_SLOT-->
    </template>
    <template #content>
      <!--CONTENT_SLOT-->
    </template>
    <template #docs>
      <div class="docs-card__view">
        <!--DOCS_SLOT-->
      </div>
    </template>
  </docs-component>
</template>

<!--SCRIPT_SLOT-->

<!--STYLE_SLOT-->
