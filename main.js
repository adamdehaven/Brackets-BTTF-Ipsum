define(function(require, exports, module) {
  'use strict';

  var CommandManager = brackets.getModule('command/CommandManager'),
      EditorManager = brackets.getModule('editor/EditorManager'),
      Menus = brackets.getModule('command/Menus'),
      ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
      SCRIPT_URL = ExtensionUtils.getModuleUrl(module) + 'src/script.txt',
      KEY_BINDINGS = [
        {
          key: 'Ctrl-Shift-B',
          platform: 'win'
        }, {
          key: 'Cmd-Shift-B',
          platform: 'mac'
        }, {
          key: 'Ctrl-Shift-B'
        }
      ],
      TOOLBAR_BTN = $(document.createElement('a'))
        .attr('id', 'adamdehaven-bttf-ipsum-icon')
        .attr('href', '#')
        .attr('title', 'Insert BTTF Ipsum')
        .on('click', function(e) {
          e.preventDefault();
          handlePlaceholderRequest();
        }).appendTo($('#main-toolbar .buttons'));
  
  ExtensionUtils.loadStyleSheet(module, 'src/styles.css');

  // Generates random int between min and max
  function randNum(min, max) {
    return Math.floor(Math.random() * (1 + max - min) + min);
  }
  
  // Parse the script text
  function generateText(source) {
    var sentences = 5,
        eof = 3162 - 1, // Number of lines in script.txt minus one (zero-based)
        rand = randNum(0, eof), // Generate random starting point within array
        scriptArray = source.split('\n'), // Each line of script.txt to array item
        scriptSlice = scriptArray.slice(rand); // Start at a random spot in the scriptArray
    
    // Create paragraph
    function createParagraph() {
      var paragraph = '';
      for(var i = 0; i < sentences; i++) {
        paragraph += ' ' + $.trim(scriptSlice[i]);
      }

      return $.trim(paragraph);
    }
    
    return createParagraph();
    
  }

  // Function to run when the menu item is clicked
  function handlePlaceholderRequest() {
    var editor = EditorManager.getFocusedEditor();
    
    if (editor) {
      var insertionPos = editor.getCursorPos();
      
      $.ajax({
        type: 'GET',
        url: SCRIPT_URL,
        success: function(scriptText) {
          var theText = generateText(scriptText);
          editor.document.replaceRange(theText, insertionPos);
        }
      });
    }
  }

  // First, register a command - a UI-less object associating an id to a handler
  var ADAMDEHAVEN_BTTF_IPSUM = 'adamdehaven.bttf-ipsum'; // package-style naming to avoid collisions
  CommandManager.register('Insert BTTF Ipsum', ADAMDEHAVEN_BTTF_IPSUM, handlePlaceholderRequest);

  // Then create a menu item bound to the command
  // The label of the menu item is the name we gave the command (see above)
  var editMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
  editMenu.addMenuDivider();
  editMenu.addMenuItem(ADAMDEHAVEN_BTTF_IPSUM, KEY_BINDINGS);
});
