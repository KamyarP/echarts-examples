<template>
  <div id="main-container">
    <div
      id="editor-left-container"
      :style="{ width: leftContainerSize + '%' }"
      v-if="!shared.isMobile"
    >
      <el-tabs v-model="currentTab" type="border-card">
        <el-tab-pane name="code-editor">
          <span slot="label">{{ $t('editor.tabEditor') }}</span>
          <el-container>
            <el-header id="editor-control-panel">
              <div class="languages">
                <el-tooltip
                  :content="$t('editor.tooltip.jsMode')"
                  placement="bottom"
                >
                  <a
                    :class="{ js: true, active: !shared.typeCheck }"
                    @click="changeLang('js')"
                    >JS</a
                  >
                </el-tooltip>
                <el-tooltip
                  :content="$t(`editor.tooltip.${hasTs ? 'tsMode' : 'noTs'}`)"
                  placement="bottom"
                >
                  <a
                    @click="hasTs && changeLang('ts')"
                    :class="{
                      ts: true,
                      active: shared.typeCheck,
                      disabled: !hasTs
                    }"
                    >TS</a
                  >
                </el-tooltip>
              </div>
              <div class="editor-controls">
                <a
                  class="btn btn-sm codepen"
                  @click="toExternalEditor('CodePen')"
                  :title="$t('editor.openWithCodePen')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="none"
                  >
                    <path
                      d="M21.838 8.445c0-.001-.001-.001 0 0l-.003-.004l-.001-.001v-.001a.809.809 0 0 0-.235-.228l-9.164-6.08a.834.834 0 0 0-.898 0L2.371 8.214A.786.786 0 0 0 2 8.897v6.16a.789.789 0 0 0 .131.448v.001l.002.002l.01.015v.002h.001l.001.001l.001.001c.063.088.14.16.226.215l9.165 6.082a.787.787 0 0 0 .448.139a.784.784 0 0 0 .45-.139l9.165-6.082a.794.794 0 0 0 .371-.685v-6.16a.793.793 0 0 0-.133-.452zm-9.057-4.172l6.953 4.613l-3.183 2.112l-3.771-2.536V4.273zm-1.592 0v4.189l-3.771 2.536l-3.181-2.111l6.952-4.614zm-7.595 6.098l2.395 1.59l-2.395 1.611v-3.201zm7.595 9.311l-6.96-4.617l3.195-2.15l3.765 2.498v4.269zm.795-5.653l-3.128-2.078l3.128-2.105l3.131 2.105l-3.131 2.078zm.797 5.653v-4.27l3.766-2.498l3.193 2.15l-6.959 4.618zm7.597-6.11l-2.396-1.611l2.396-1.59v3.201z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </a>
                <a
                  class="btn btn-sm codesandbox"
                  @click="toExternalEditor('CodeSandbox')"
                  :title="$t('editor.openWithCodeSandbox')"
                >
                  <svg
                    viewBox="0 0 512 512"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M69 153.99L256 263.99M256 263.99L443 153.99M256 263.99V463.99M448 341.37V170.61C447.993 165.021 446.523 159.531 443.735 154.687C440.947 149.843 436.939 145.814 432.11 143L280.11 54.54C272.787 50.2765 264.464 48.0303 255.99 48.0303C247.516 48.0303 239.193 50.2765 231.87 54.54L79.89 143C75.0609 145.814 71.053 149.843 68.2652 154.687C65.4773 159.531 64.0068 165.021 64 170.61V341.37C64.0033 346.962 65.4722 352.456 68.2602 357.304C71.0482 362.152 75.058 366.185 79.89 369L231.89 457.46C239.215 461.718 247.537 463.96 256.01 463.96C264.483 463.96 272.805 461.718 280.13 457.46L432.13 369C436.958 366.182 440.964 362.148 443.748 357.301C446.533 352.453 447.999 346.96 448 341.37Z"
                      stroke="currentColor"
                      stroke-width="38"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </a>
                <a
                  class="btn btn-sm format"
                  :title="$t('editor.format')"
                  :disabled="!formatterReady"
                  :style="{ cursor: formatterReady ? '' : 'progress' }"
                  @click="format"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </a>
                <a class="btn btn-default btn-sm run" @click="disposeAndRun">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{{ $t('editor.run') }}</span>
                </a>
              </div>
            </el-header>
            <el-main>
              <CodeMonaco
                v-if="shared.typeCheck"
                id="code-panel"
                :initialCode="initialCode"
                @ready="prepareFormatter"
              />
              <CodeAce v-else id="code-panel" :initialCode="initialCode" />
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane
          :label="$t('editor.tabFullCodePreview')"
          name="full-code"
          :lazy="true"
        >
          <el-container style="width: 100%; height: 100%">
            <el-header id="full-code-generate-config">
              <span class="full-code-generate-config-label">
                <!-- <i class="el-icon-setting"></i> 配置 -->
              </span>
              <el-switch
                v-model="fullCodeConfig.minimal"
                :active-text="$t('editor.minimalBundle')"
                :inactive-text="''"
              >
              </el-switch>
              <el-switch
                v-if="!shared.typeCheck"
                v-model="fullCodeConfig.esm"
                active-text="ES Modules"
                :inactive-text="''"
              >
              </el-switch>
            </el-header>
            <el-main>
              <FullCodePreview :code="fullCode"></FullCodePreview>
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane :label="$t('editor.tabOptionPreview')" name="full-option">
          <div id="option-outline" ref="optionOutline"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div
      class="handler"
      id="h-handler"
      @mousedown="onSplitterDragStart"
      :style="{ left: leftContainerSize + '%' }"
      v-if="!shared.isMobile"
    ></div>
    <Preview
      :inEditor="true"
      @ready="onPreviewReady"
      class="right-container"
      ref="preview"
      :style="{
        width: 100 - leftContainerSize + '%',
        left: leftContainerSize + '%'
      }"
    ></Preview>
  </div>
</template>

<script>
import CodeAce from './CodeAce.vue';
import CodeMonaco from './CodeMonaco.vue';
import FullCodePreview from './FullCodePreview.vue';
import Preview from './Preview.vue';
import {
  store,
  loadExampleCode,
  parseSourceCode,
  getExampleConfig,
  CODE_CHANGED_FLAG
} from '../common/store';
import { collectDeps, buildExampleCode } from '../../common/buildCode';
import { gotoURL } from '../common/route';
import { mount } from '@lang/object-visualizer';

import './object-visualizer.css';
import { URL_PARAMS } from '../common/config';
import { formatCode } from '../common/helper';
import openWithCodePen from './sandbox/openwith/codepen';
import openWithCodeSandbox from './sandbox/openwith/codesandbox';

export default {
  components: {
    CodeAce,
    CodeMonaco,
    FullCodePreview,
    Preview
  },

  data() {
    return {
      leftContainerSize: 40,
      shared: store,
      initialCode: '',

      currentTab: 'code-editor',

      fullCode: '',

      exampleConfig: getExampleConfig(),

      fullCodeConfig: {
        minimal: false,
        esm: true,
        node: false // If is in node
      },

      formatterReady: false
    };
  },

  computed: {
    hasTs() {
      return this.exampleConfig && this.exampleConfig.ts;
    }
  },

  mounted() {
    if (store.isMobile) {
      this.leftContainerSize = 0;
      loadExampleCode().then((code) => {
        // No editor available. Set to runCode directly.
        store.runCode = parseSourceCode(code);
      });
    } else {
      loadExampleCode().then((code) => {
        // Only set the code in editor. editor will sync to the store.
        this.initialCode = parseSourceCode(code);
        if (store.initialCode !== CODE_CHANGED_FLAG) {
          store.initialCode = this.initialCode;
        }
      });

      window.addEventListener('mousemove', (e) => {
        if (this.mousedown) {
          let percentage = e.clientX / window.innerWidth;
          percentage = Math.min(0.9, Math.max(0.1, percentage));
          this.leftContainerSize = percentage * 100;
        }
      });

      window.addEventListener('mouseup', () => {
        this.mousedown = false;
      });

      // Save code as a sharable link when ctrl/cmd + s is pressed.
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          const previewRef = this.$refs.preview;
          previewRef && previewRef.share();
          e.preventDefault();
        }
      });

      window.addEventListener('beforeunload', (e) => {
        // no repeated prompt if already confirmed or the code is not changed
        if (
          window.__EDITOR_NO_LEAVE_CONFIRMATION__ ||
          store.sourceCode === this.initialCode
        ) {
          return;
        }
        // prevent the code from being lost accidentally due to refreshing or closing the page
        e.preventDefault();
        e.returnValue = '';
      });

      // ensure prettier
      store.typeCheck || this.prepareFormatter();
    }
  },

  methods: {
    toExternalEditor(vendor) {
      const previewRef = this.$refs.preview;
      if (!previewRef) {
        return;
      }
      const assets = previewRef.getAssets();
      const vendors = {
        CodePen: openWithCodePen,
        CodeSandbox: openWithCodeSandbox
      };
      vendors[vendor](
        this.exampleConfig && this.exampleConfig.title,
        assets.scripts,
        assets.css
      );
    },
    onSplitterDragStart() {
      this.mousedown = true;
    },
    disposeAndRun() {
      this.$refs.preview.refreshAll();
    },
    updateFullCode() {
      const option = this.$refs.preview.getOption();
      if (!option) {
        return;
      }
      const deps = collectDeps(option);
      deps.push(store.renderer === 'svg' ? 'SVGRenderer' : 'CanvasRenderer');
      this.fullCode = buildExampleCode(store.sourceCode, deps, {
        minimal: this.fullCodeConfig.minimal,
        ts: store.typeCheck,
        esm: this.fullCodeConfig.esm,
        // legacy: true,
        theme: store.darkMode ? 'dark' : '',
        renderer: store.renderer,
        useDirtyRect: store.useDirtyRect,
        ROOT_PATH: store.cdnRoot,
        isZHLang: this.$i18n.locale === 'zh'
      });
      // Format
      formatCode(this.fullCode).then((code) => {
        this.fullCode = code;
      });
    },
    updateOptionOutline() {
      const option = Object.freeze(this.$refs.preview.getOption());
      if (!option) {
        return;
      }
      const tipTitle = this.$t('editor.tooltip.gotoDoc');
      const lang = this.$i18n.locale;
      mount(option, this.$refs.optionOutline, {
        getKeys(object) {
          return Object.keys(object).filter((key) => {
            if (Array.isArray(object[key]) && !object[key].length) {
              return false;
            }
            return true;
          });
        },
        renderName(name, path) {
          let obj = option;
          let hash = [];
          let isTopLevel = true;
          for (let i = 0; i < path.length; i++) {
            let key = path[i];
            obj = obj[key];

            if (obj == null) {
              hash.push(key);
              break;
            }

            if (Array.isArray(obj) && isTopLevel) {
              // Get type of component / series.
              const item = obj[path[i + 1]];
              const type = item && item.type;
              if (type) {
                key += '-' + type;
                i++;
                obj = item;
              }
            } else if (!isNaN(key)) {
              // Ignore data[0]
              continue;
            }
            hash.push(key);
          }

          const isObjOrArray = typeof obj === 'object' && obj != null;
          const link = hash.includes('bmap')
            ? 'https://github.com/apache/echarts/blob/release/extension-src/bmap/README.md'
            : `https://echarts.apache.org/${lang}/option.html#${hash.join(
                '.'
              )}`;
          return !isObjOrArray
            ? `<a href="${link}" target="_blank" title="${tipTitle}">${name}</a>`
            : `${name}<a href="${link}" target="_blank" title="${tipTitle}"><i class="el-icon-document"></i></a>`;
        },
        expandOnCreatedAndUpdated(path) {
          return (
            path.length === 0 || (path[0] === 'series' && path.length <= 1)
          );
        }
      });
    },
    updateTabContent(tab) {
      if (tab === 'full-code') {
        this.updateFullCode();
      } else if (tab === 'full-option') {
        this.updateOptionOutline();
      }
    },
    changeLang(lang) {
      if ((URL_PARAMS.lang || 'js').toLowerCase() !== lang) {
        if (!this.initialCode || store.sourceCode === this.initialCode) {
          gotoURL({ lang });
        } else {
          this.$confirm(this.$t('editor.codeChangedConfirm'), '', {
            confirmButtonText: this.$t('editor.confirmButtonText'),
            cancelButtonText: this.$t('editor.cancelButtonText'),
            type: 'warning'
          })
            .then(() => {
              // already confirmed
              window.__EDITOR_NO_LEAVE_CONFIRMATION__ = true;
              gotoURL({ lang });
            })
            .catch(() => {});
        }
      }
    },
    format() {
      if (!this.formatterReady) {
        console.warn('formatter is not ready yet!');
        return;
      }
      formatCode(store.sourceCode).then((code) => {
        if (
          code === this.initialCode &&
          store.sourceCode !== this.initialCode
        ) {
          // If formatted code is the same as initial code but source code is changed,
          // should also trigger update
          this.initialCode = store.sourceCode;
        }
        this.$nextTick(() => {
          this.initialCode = code;
        });
      });
    },
    prepareFormatter() {
      return formatCode(' ').then(() => {
        this.formatterReady = true;
      });
    },
    onPreviewReady() {
      this.updateTabContent(this.currentTab);
    }
  },

  watch: {
    currentTab(tab) {
      this.updateTabContent(tab);
    },
    'shared.runHash'() {
      this.updateTabContent(this.currentTab);
    },
    fullCodeConfig: {
      deep: true,
      handler() {
        this.updateFullCode();
      }
    }
  }
};
</script>

<style lang="scss">
@import '../style/color.scss';

$control-panel-height: 30px;
$pd-basic: 10px;
$handler-width: 5px;

#main-container {
  .handler {
    position: absolute;
    left: 50%;

    top: 0;
    bottom: 0;
    width: $handler-width;

    cursor: col-resize;
    z-index: 100;
    background-color: transparent;
    border-left: 1px solid #ececec;
    // border-right: 1px solid $clr-border;
  }
}

#editor-left-container {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;

  width: 50%;

  .el-tab-pane {
    height: 100%;

    .el-container {
      width: 100%;
      height: 100%;
    }

    .el-header {
      height: $control-panel-height !important;
      position: relative;
      z-index: 10;
      padding: 0;
    }
    .el-main {
      padding: 0;
      position: relative;

      ::-webkit-scrollbar {
        height: 8px;
        width: 8px;
        transition: all 0.3s ease-in-out;
        border-radius: 2px;
      }

      ::-webkit-scrollbar-button {
        display: none;
      }

      ::-webkit-scrollbar-thumb {
        width: 8px;
        min-height: 15px;
        background: rgba(50, 50, 50, 0.6) !important;
        transition: all 0.3s ease-in-out;
        border-radius: 2px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.5) !important;
      }
    }
  }

  .el-tabs {
    box-shadow: none;
  }

  .el-tabs--border-card > .el-tabs__header {
    border-bottom: none;
  }

  .el-tabs__content {
    position: absolute;
    top: 34px;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0;
  }

  .el-tabs__item {
    height: 34px;
    line-height: 34px;
  }
}

#editor-control-panel,
#full-code-generate-config {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

#option-outline {
  // height: 100%;
  // Fix safari
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;

  font-size: 13px;

  font-family: 'Source Code Pro', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas',
    monospace;

  .el-icon-document {
    margin-left: 5px;
    font-size: 1rem;

    &:hover {
      text-decoration: underline;
    }
  }
}

#full-code-generate-config {
  .full-code-generate-config-label {
    height: $control-panel-height;
    line-height: $control-panel-height;
    vertical-align: middle;
    margin: 0 0 0 20px;
  }

  .el-switch {
    margin-right: 10px;
  }

  .el-switch__label {
    margin-left: 8px;
    margin-top: -2px;
  }
  .el-switch__label * {
    font-size: 12px;
  }
}

#editor-control-panel {
  .setting-panel {
    display: inline-block;

    .btn-group + .btn-group {
      margin-left: $pd-basic;
    }
  }

  .languages {
    display: inline-block;
    padding: 2px 10px;
    font-weight: bold;

    a {
      display: inline-block;
      padding: 3px 10px;
      margin-left: 5px;
      vertical-align: middle;
      cursor: pointer;

      &.ts {
        color: #3178c6;
      }

      &.ts.disabled {
        color: #ddd;
        cursor: default;

        &:hover {
          text-decoration: none;
        }
      }

      &.js {
        color: #000;
      }

      &.active {
        font-size: 12px;
        border-radius: 3px;

        &.js {
          background: #f7df1e;
          color: #000;
        }

        &.ts {
          background: #3178c6;
          color: #fff;
        }
      }
    }
  }

  .editor-controls {
    float: right;

    .el-switch__label {
      margin-top: -3px;
    }
    .el-switch__label * {
      font-size: 12px;
    }

    .btn {
      border-radius: 0;
      margin: 0;
      border: none;
      height: 30px;

      background: none;
      color: $clr-text;

      &:hover {
        color: #409eff;
      }

      & > * {
        display: inline-block;
        vertical-align: middle;
      }

      svg {
        width: 15px;
        height: 15px;
      }

      &.run {
        color: #fff;
        background-color: #409eff;
      }
      &.run:hover {
        background-color: lighten($color: #409eff, $amount: 5);
      }

      &.codepen {
        svg {
          transform: scale(1.08);
        }
      }
    }
  }
}

.right-container {
  position: absolute;
  right: 0;

  width: 50%;
  height: 100%;
  padding: 0;
  padding-left: $handler-width;
  border: none;
  z-index: 30;

  background: $clr-bg;
}
</style>
