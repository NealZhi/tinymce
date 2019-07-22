import { ApproxStructure, Keyboard, Keys, Log, Pipeline } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { TinyActions, TinyApis, TinyLoader } from '@ephox/mcagar';
import { Element } from '@ephox/sugar';
import Editor from 'tinymce/core/api/Editor';
import NoneditablePlugin from 'tinymce/plugins/noneditable/Plugin';
import Theme from 'tinymce/themes/silver/Theme';

UnitTest.asynctest('browser.tinymce.core.delete.CefDeleteNoneditableTest', (success, failure) => {

  Theme();
  NoneditablePlugin();

  TinyLoader.setup((editor: Editor, onSuccess, onFailure) => {
    const tinyApis = TinyApis(editor);
    const tinyActions = TinyActions(editor);

    Pipeline.async({}, [
      tinyApis.sFocus,

      Log.stepsAsStep('TINY-3868', 'Should not backspace cef inside cef with ranged selection', [
        tinyApis.sSetContent('<div class="mceNonEditable"><span class="mceNonEditable">a</span> b</div><p>c</p>'),
        tinyApis.sSelect('div', [0]),
        tinyActions.sContentKeystroke(Keys.backspace(), {}),
        tinyApis.sAssertSelection([0], 0, [0], 1),
        tinyApis.sAssertContentStructure(
          ApproxStructure.build((s, str, arr) => {
            return s.element('body', {
              children: [
                s.element('div', {
                  children: [
                    s.element('span', {
                      children: [
                        s.text(str.is('a'))
                      ]
                    }),
                    s.text(str.is(' b'))
                  ]
                }),
                s.element('p', {
                  children: [
                    s.text(str.is('c'))
                  ]
                })
              ]
            });
          })
        )
      ]),

      Log.stepsAsStep('TINY-3868', 'Should not delete cef inside cef with ranged selection', [
        tinyApis.sSetContent('<div class="mceNonEditable"><span class="mceNonEditable">a</span> b</div><p>c</p>'),
        tinyApis.sSelect('div', [0]),
        tinyActions.sContentKeystroke(46, {}), // 46 = delete keycode
        tinyApis.sAssertSelection([0], 0, [0], 1),
        tinyApis.sAssertContentStructure(
          ApproxStructure.build((s, str, arr) => {
            return s.element('body', {
              children: [
                s.element('div', {
                  children: [
                    s.element('span', {
                      children: [
                        s.text(str.is('a'))
                      ]
                    }),
                    s.text(str.is(' b'))
                  ]
                }),
                s.element('p', {
                  children: [
                    s.text(str.is('c'))
                  ]
                })
              ]
            });
          })
        )
      ]),

      Log.stepsAsStep('TINY-3868', 'Should not backspace cef inside cef with collapsed selection after inner cef', [
        tinyApis.sSetContent('<div class="mceNonEditable"><span class="mceNonEditable">a</span> b</div><p>c</p>'),
        tinyApis.sSelect('div', [0]),
        Keyboard.sKeydown(Element.fromDom(editor.getDoc()), Keys.right(), { }),
        tinyActions.sContentKeystroke(Keys.backspace(), {}),
        tinyApis.sAssertSelection([0, 1], 1, [0, 1], 1),
        tinyApis.sAssertContentStructure(
          ApproxStructure.build((s, str, arr) => {
            return s.element('body', {
              children: [
                s.element('div', {
                  children: [
                    s.element('span', {
                      children: [
                        s.text(str.is('a'))
                      ]
                    }),
                    s.text(str.is('\uFEFF')),
                    s.text(str.is(' b'))
                  ]
                }),
                s.element('p', {
                  children: [
                    s.text(str.is('c'))
                  ]
                })
              ]
            });
          })
        )
      ]),

      Log.stepsAsStep('TINY-3868', 'Should not delete cef inside cef with collapsed selection before inner cef', [
        tinyApis.sSetContent('<div class="mceNonEditable"><span class="mceNonEditable">a</span> b</div><p>c</p>'),
        tinyApis.sSelect('div', [0]),
        Keyboard.sKeydown(Element.fromDom(editor.getDoc()), Keys.left(), { }),
        tinyActions.sContentKeystroke(46, {}), // 46 = delete keycode
        tinyApis.sAssertSelection([0, 0], 0, [0, 0], 0),
        tinyApis.sAssertContentStructure(
          ApproxStructure.build((s, str, arr) => {
            return s.element('body', {
              children: [
                s.element('div', {
                  children: [
                    s.text(str.is('\uFEFF')),
                    s.element('span', {
                      children: [
                        s.text(str.is('a'))
                      ]
                    }),
                    s.text(str.is(' b'))
                  ]
                }),
                s.element('p', {
                  children: [
                    s.text(str.is('c'))
                  ]
                })
              ]
            });
          })
        )
      ]),

      Log.stepsAsStep('TINY-3868', 'Should backspace cef inside cet with collapsed selection after inner cef', [
        tinyApis.sSetContent('<div class="mceNonEditable"><span class="mceEditable"><span class="mceNonEditable">az</span> b</span> c</div><p>d</p>'),
        tinyApis.sSelect('div>span', [0]),
        Keyboard.sKeydown(Element.fromDom(editor.getDoc()), Keys.right(), { }),
        tinyActions.sContentKeystroke(Keys.backspace(), {}),
        tinyApis.sAssertSelection([0, 0, 0], 0, [0, 0, 0], 0),
        tinyApis.sAssertContentStructure(
          ApproxStructure.build((s, str, arr) => {
            return s.element('body', {
              children: [
                s.element('div', {
                  children: [
                    s.element('span', {
                      children: [
                        s.text(str.is('\u00A0' + 'b'))
                      ]
                    }),
                    s.text(str.is(' c'))
                  ]
                }),
                s.element('p', {
                  children: [
                    s.text(str.is('d'))
                  ]
                })
              ]
            });
          })
        )
      ]),
    ], onSuccess, onFailure);
  }, {
    base_url: '/project/tinymce/js/tinymce',
    plugins: 'anchor noneditable'
  }, success, failure);
});
