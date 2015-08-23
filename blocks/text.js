/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Text blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.text');

goog.require('Blockly.Blocks');


Blockly.Blocks['text'] = {
  /**
   * Block for text value.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
    this.setColours('#00aa00', '#007a00');
    this.appendDummyInput()
        .appendField('"')
        .appendField(new Blockly.FieldTextInput(''), 'TEXT')
        .appendField('"');
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.TEXT_TEXT_TOOLTIP);
  },
};

Blockly.Blocks['text_join'] = {
  /**
   * Block for creating a string made up of any number of elements of any type.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_JOIN_HELPURL);
    this.setColours('#00aa00', '#007a00');
    this.appendValueInput('ADD0')
        .appendField(Blockly.Msg.TEXT_JOIN_TITLE_CREATEWITH);
    this.appendValueInput('ADD1');
    this.setOutput(true, 'String');
    this.setMutator(new Blockly.Mutator(['text_create_join_item']));
    this.setTooltip(Blockly.Msg.TEXT_JOIN_TOOLTIP);
    this.itemCount_ = 2;
  },
  /**
   * Create XML to represent number of text inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the text inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    for (var x = 0; x < this.itemCount_; x++) {
      this.removeInput('ADD' + x);
    }
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    for (var x = 0; x < this.itemCount_; x++) {
      var input = this.appendValueInput('ADD' + x);
      if (x == 0) {
        input.appendField(Blockly.Msg.TEXT_JOIN_TITLE_CREATEWITH);
      }
    }
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
          .appendField(new Blockly.FieldImage(Blockly.pathToBlockly +
          'media/quote0.png', 12, 12, '"'))
          .appendField(new Blockly.FieldImage(Blockly.pathToBlockly +
          'media/quote1.png', 12, 12, '"'));
    }
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = Blockly.Block.obtain(workspace,
                                           'text_create_join_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var x = 0; x < this.itemCount_; x++) {
      var itemBlock = Blockly.Block.obtain(workspace, 'text_create_join_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    // Disconnect all input blocks and remove all inputs.
    if (this.itemCount_ == 0) {
      this.removeInput('EMPTY');
    } else {
      for (var x = this.itemCount_ - 1; x >= 0; x--) {
        this.removeInput('ADD' + x);
      }
    }
    this.itemCount_ = 0;
    // Rebuild the block's inputs.
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    while (itemBlock) {
      var input = this.appendValueInput('ADD' + this.itemCount_);
      if (this.itemCount_ == 0) {
        input.appendField(Blockly.Msg.TEXT_JOIN_TITLE_CREATEWITH);
      }
      // Reconnect any child blocks.
      if (itemBlock.valueConnection_) {
        input.connection.connect(itemBlock.valueConnection_);
      }
      this.itemCount_++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
          .appendField(new Blockly.FieldImage(Blockly.pathToBlockly +
          'media/quote0.png', 12, 12, '"'))
          .appendField(new Blockly.FieldImage(Blockly.pathToBlockly +
          'media/quote1.png', 12, 12, '"'));
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var x = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + x);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      x++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  }
};

Blockly.Blocks['text_create_join_container'] = {
  /**
   * Mutator block for container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColours('#00aa00', '#007a00');
    this.appendDummyInput()
        .appendField(Blockly.Msg.TEXT_CREATE_JOIN_TITLE_JOIN);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.TEXT_CREATE_JOIN_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['text_create_join_item'] = {
  /**
   * Mutator block for add items.
   * @this Blockly.Block
   */
  init: function() {
    this.setColours('#00aa00', '#007a00');
    this.appendDummyInput()
        .appendField(Blockly.Msg.TEXT_CREATE_JOIN_ITEM_TITLE_ITEM);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TEXT_CREATE_JOIN_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};


Blockly.Blocks['text_concat2'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_CONCAT2);
    this.setColours('#00aa00', '#007a00');
    this.setOutput(true, 'String');
    this.appendValueInput('TEXT0')
        .setCheck('String');
    this.appendValueInput('TEXT1')
        .setCheck('String')
        .appendField('+');
    this.setTooltip(Blockly.Msg.TEXT_CONCAT2_TOOLTIP);
    this.setInputsInline(true);
  }
};


Blockly.Blocks['text_concat3'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_CONCAT3);
    this.setColours('#00aa00', '#007a00');
    this.appendValueInput('TEXT0')
        .setCheck('String');
    this.appendValueInput('TEXT1')
        .setCheck('String')
        .appendField('+');
    this.appendValueInput('TEXT2')
        .setCheck('String')
        .appendField('+');
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.TEXT_CONCAT3_TOOLTIP);
    this.setInputsInline(true);
  }
};


Blockly.Blocks['text_concat4'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_CONCAT4);
    this.setColours('#00aa00', '#007a00');
    this.appendValueInput('TEXT0')
        .setCheck('String');
    this.appendValueInput('TEXT1')
        .setCheck('String')
        .appendField('+');
    this.appendValueInput('TEXT2')
        .setCheck('String')
        .appendField('+');
    this.appendValueInput('TEXT3')
        .setCheck('String')
        .appendField('+');
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.TEXT_CONCAT4_TOOLTIP);
    this.setInputsInline(true);
  }
};


Blockly.Blocks['text_concat5'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_CONCAT5);
    this.setColours('#00aa00', '#007a00');
    this.appendValueInput('TEXT0')
        .setCheck('String');
    this.appendValueInput('TEXT1')
        .setCheck('String')
        .appendField('+');
    this.appendValueInput('TEXT2')
        .setCheck('String')
        .appendField('+');
    this.appendValueInput('TEXT3')
        .setCheck('String')
        .appendField('+');
    this.appendValueInput('TEXT4')
        .setCheck('String')
        .appendField('+');
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.TEXT_CONCAT5_TOOLTIP);
    this.setInputsInline(true);
  }
};


Blockly.Blocks['text_mult'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_MULT_HELP);
    this.setColours('#00aa00', '#007a00');
    this.setOutput(true, 'String');
    this.appendValueInput('TIMES')
        .setCheck('Number');
    this.appendValueInput('TEXT')
        .setCheck('String')
        .appendField(Blockly.Msg.TEXT_MULTIPLICATION_SYMBOL);
    this.setTooltip(Blockly.Msg.TEXT_MULT_TOOLTIP);
    this.setInputsInline(true);
  }
};


Blockly.Blocks['text_append'] = {
  /**
   * Block for appending to a variable in place.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_APPEND_HELPURL);
    this.setColours('#00aa00', '#007a00');
    this.appendValueInput('TEXT')
        .setCheck('String')
        .appendField(Blockly.Msg.TEXT_APPEND_TO)
        .appendField(new Blockly.FieldVariable(
        Blockly.Msg.TEXT_APPEND_VARIABLE), 'VAR')
        .appendField(Blockly.Msg.TEXT_APPEND_APPENDTEXT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.TEXT_APPEND_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
    this.setInputsInline(true);
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  }
};

Blockly.Blocks['text_length'] = {
  /**
   * Block for string length.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_LENGTH_HELPURL);
    this.setColours('#0080E4', '#003660');
    this.interpolateMsg(Blockly.Msg.TEXT_LENGTH_TITLE,
                        ['VALUE', ['String', 'Array'], Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.TEXT_LENGTH_TOOLTIP);
    this.setInputsInline(true);
  }
};

Blockly.Blocks['text_isEmpty'] = {
  /**
   * Block for is the string null?
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_ISEMPTY_HELPURL);
    this.setColours('#00aa00', '#007a00');
    this.interpolateMsg(Blockly.Msg.TEXT_ISEMPTY_TITLE,
                        ['VALUE', ['String', 'Array'], Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setOutput(true, 'Boolean');
    this.setTooltip(Blockly.Msg.TEXT_ISEMPTY_TOOLTIP);
    this.setInputsInline(true);
  }
};

Blockly.Blocks['text_indexOf'] = {
  /**
   * Block for finding a substring in the text.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.TEXT_INDEXOF_OPERATOR_FIRST, 'FIRST'],
         [Blockly.Msg.TEXT_INDEXOF_OPERATOR_LAST, 'LAST']];
    this.setHelpUrl(Blockly.Msg.TEXT_INDEXOF_HELPURL);
    this.setColours('#00aa00', '#007a00');
    this.setOutput(true, 'Number');
    this.appendValueInput('FIND')
        .setCheck('String')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'END');
    this.appendValueInput('VALUE')
        .setCheck('String')
        .appendField(Blockly.Msg.TEXT_INDEXOF_INPUT_INTEXT);
    if (Blockly.Msg.TEXT_INDEXOF_TAIL) {
      this.appendDummyInput().appendField(Blockly.Msg.TEXT_INDEXOF_TAIL);
    }
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.TEXT_INDEXOF_TOOLTIP);
  }
};

Blockly.Blocks['text_charAt'] = {
  /**
   * Block for getting a character from the string.
   * @this Blockly.Block
   */
  init: function() {
    this.WHERE_OPTIONS =
        [[Blockly.Msg.TEXT_CHARAT_FROM_START, 'FROM_START'],
         [Blockly.Msg.TEXT_CHARAT_FROM_END, 'FROM_END'],
         [Blockly.Msg.TEXT_CHARAT_FIRST, 'FIRST'],
         [Blockly.Msg.TEXT_CHARAT_LAST, 'LAST']];
//         [Blockly.Msg.TEXT_CHARAT_RANDOM, 'RANDOM']];
    this.setHelpUrl(Blockly.Msg.TEXT_CHARAT_HELPURL);
    this.setColours('#00aa00', '#007a00');
    this.setOutput(true, 'String');
    this.appendValueInput('VALUE')
        .setCheck('String')
        .appendField(Blockly.Msg.TEXT_CHARAT_INPUT_INTEXT);
    this.appendDummyInput('AT');
    this.setInputsInline(true);
    this.updateAt_(true);
    this.setTooltip(Blockly.Msg.TEXT_CHARAT_TOOLTIP);
  },
  /**
   * Create XML to represent whether there is an 'AT' input.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    var isAt = this.getInput('AT').type == Blockly.INPUT_VALUE;
    container.setAttribute('at', isAt);
    return container;
  },
  /**
   * Parse XML to restore the 'AT' input.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    // Note: Until January 2013 this block did not have mutations,
    // so 'at' defaults to true.
    var isAt = (xmlElement.getAttribute('at') != 'false');
    this.updateAt_(isAt);
  },
  /**
   * Create or delete an input for the numeric index.
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this Blockly.Block
   */
  updateAt_: function(isAt) {
    // Destroy old 'AT' and 'ORDINAL' inputs.
    this.removeInput('AT');
    this.removeInput('ORDINAL', true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput('AT').setCheck('Number');
      if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput('ORDINAL')
            .appendField(Blockly.Msg.ORDINAL_NUMBER_SUFFIX);
      }
    } else {
      this.appendDummyInput('AT');
    }
    if (Blockly.Msg.TEXT_CHARAT_TAIL) {
      this.removeInput('TAIL', true);
      this.appendDummyInput('TAIL')
          .appendField(Blockly.Msg.TEXT_CHARAT_TAIL);
    }
    var menu = new Blockly.FieldDropdown(this.WHERE_OPTIONS, function(value) {
      var newAt = (value == 'FROM_START') || (value == 'FROM_END');
      // The 'isAt' variable is available due to this function being a closure.
      if (newAt != isAt) {
        var block = this.sourceBlock_;
        block.updateAt_(newAt);
        // This menu has been destroyed and replaced.  Update the replacement.
        block.setFieldValue(value, 'WHERE');
        return null;
      }
      return undefined;
    });
    this.getInput('AT').appendField(menu, 'WHERE');
  }
};


Blockly.Blocks['text_subscript'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_CHARAT_HELPURL);
    this.setColours('#00aa00', '#007a00');
    this.setOutput(true, 'String');
    this.appendDummyInput()
        .appendField(Blockly.Msg.TEXT_SUBSCRIPT_TITLE);
    this.appendValueInput('INDEX')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField(Blockly.Msg.TEXT_SUBSCRIPT_FROM_STRING);
    this.appendValueInput('VALUE')
        .setCheck('String');
    if(Blockly.Msg.TEXT_SUBSCRIPT_TAIL) {
      this.appendDummyInput()
          .appendField(Blockly.Msg.TEXT_SUBSCRIPT_TAIL);
    }
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.TEXT_CHARAT_TOOLTIP);
  }
};


Blockly.Blocks['text_slice'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_CHARAT_HELPURL);
    this.setColours('#00aa00', '#007a00');
    this.setOutput(true, 'String');
    this.appendDummyInput()
        .appendField(Blockly.Msg.TEXT_SUBSTRING_TITLE);
    this.appendValueInput('START')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField(Blockly.Msg.TEXT_SUBSTRING_SEPARATOR);
    this.appendValueInput('END')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField(Blockly.Msg.TEXT_SUBSTRING_FROM);
    this.appendValueInput('VALUE')
        .setCheck('String');
    if(Blockly.Msg.TEXT_SUBSTRING_TAIL) {
      this.appendDummyInput()
          .appendField(Blockly.Msg.TEXT_SUBSTRING_TAIL);
    }
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.TEXT_CHARAT_TOOLTIP);
  }
};


Blockly.Blocks['text_slice_to_end'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_CHARAT_HELPURL);
    this.setColours('#00aa00', '#007a00');
    this.setOutput(true, 'String');
    this.appendDummyInput()
        .appendField(Blockly.Msg.TEXT_SUBSTRING_TITLE);
    this.appendValueInput('START')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField(Blockly.Msg.TEXT_SUBSTRING_END_OF_STRING);
    this.appendDummyInput()
        .appendField(Blockly.Msg.TEXT_SUBSTRING_FROM);
    this.appendValueInput('VALUE')
        .setCheck('String');
    if(Blockly.Msg.TEXT_SUBSTRING_TAIL) {
      this.appendDummyInput()
          .appendField(Blockly.Msg.TEXT_SUBSTRING_TAIL);
    }
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.TEXT_CHARAT_TOOLTIP);
  }
};



Blockly.Blocks['text_getSubstring'] = {
  /**
   * Block for getting substring.
   * @this Blockly.Block
   */
  init: function() {
    this.WHERE_OPTIONS_1 =
        [[Blockly.Msg.TEXT_GET_SUBSTRING_START_FROM_START, 'FROM_START'],
         [Blockly.Msg.TEXT_GET_SUBSTRING_START_FROM_END, 'FROM_END'],
         [Blockly.Msg.TEXT_GET_SUBSTRING_START_FIRST, 'FIRST']];
    this.WHERE_OPTIONS_2 =
        [[Blockly.Msg.TEXT_GET_SUBSTRING_END_FROM_START, 'FROM_START'],
         [Blockly.Msg.TEXT_GET_SUBSTRING_END_FROM_END, 'FROM_END'],
         [Blockly.Msg.TEXT_GET_SUBSTRING_END_LAST, 'LAST']];
    this.setHelpUrl(Blockly.Msg.TEXT_GET_SUBSTRING_HELPURL);
    this.setColours('#00aa00', '#007a00');
    this.appendValueInput('STRING')
        .setCheck('String')
        .appendField(Blockly.Msg.TEXT_GET_SUBSTRING_INPUT_IN_TEXT);
    this.appendDummyInput('AT1');
    this.appendDummyInput('AT2');
    if (Blockly.Msg.TEXT_GET_SUBSTRING_TAIL) {
      this.appendDummyInput('TAIL')
          .appendField(Blockly.Msg.TEXT_GET_SUBSTRING_TAIL);
    }
    this.setInputsInline(true);
    this.setOutput(true, 'String');
    this.updateAt_(1, true);
    this.updateAt_(2, true);
    this.setTooltip(Blockly.Msg.TEXT_GET_SUBSTRING_TOOLTIP);
  },
  /**
   * Create XML to represent whether there are 'AT' inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    var isAt1 = this.getInput('AT1').type == Blockly.INPUT_VALUE;
    container.setAttribute('at1', isAt1);
    var isAt2 = this.getInput('AT2').type == Blockly.INPUT_VALUE;
    container.setAttribute('at2', isAt2);
    return container;
  },
  /**
   * Parse XML to restore the 'AT' inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    var isAt1 = (xmlElement.getAttribute('at1') == 'true');
    var isAt2 = (xmlElement.getAttribute('at2') == 'true');
    this.updateAt_(1, isAt1);
    this.updateAt_(2, isAt2);
  },
  /**
   * Create or delete an input for a numeric index.
   * This block has two such inputs, independant of each other.
   * @param {number} n Specify first or second input (1 or 2).
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this Blockly.Block
   */
  updateAt_: function(n, isAt) {
    // Create or delete an input for the numeric index.
    // Destroy old 'AT' and 'ORDINAL' inputs.
    this.removeInput('AT' + n);
    this.removeInput('ORDINAL' + n, true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput('AT' + n).setCheck('Number');
      if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput('ORDINAL' + n)
            .appendField(Blockly.Msg.ORDINAL_NUMBER_SUFFIX);
      }
    } else {
      this.appendDummyInput('AT' + n);
    }
    // Move tail, if present, to end of block.
    if (n == 2 && Blockly.Msg.TEXT_GET_SUBSTRING_TAIL) {
      this.removeInput('TAIL', true);
      this.appendDummyInput('TAIL')
          .appendField(Blockly.Msg.TEXT_GET_SUBSTRING_TAIL);
    }
    var menu = new Blockly.FieldDropdown(this['WHERE_OPTIONS_' + n],
        function(value) {
      var newAt = (value == 'FROM_START') || (value == 'FROM_END');
      // The 'isAt' variable is available due to this function being a closure.
      if (newAt != isAt) {
        var block = this.sourceBlock_;
        block.updateAt_(n, newAt);
        // This menu has been destroyed and replaced.  Update the replacement.
        block.setFieldValue(value, 'WHERE' + n);
        return null;
      }
      return undefined;
    });
    this.getInput('AT' + n)
        .appendField(menu, 'WHERE' + n);
    if (n == 1) {
      this.moveInputBefore('AT1', 'AT2');
    }
  }
};

Blockly.Blocks['text_changeCase'] = {
  /**
   * Block for changing capitalization.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.TEXT_CHANGECASE_OPERATOR_UPPERCASE, 'UPPERCASE'],
         [Blockly.Msg.TEXT_CHANGECASE_OPERATOR_LOWERCASE, 'LOWERCASE'],
         [Blockly.Msg.TEXT_CHANGECASE_OPERATOR_TITLECASE, 'TITLECASE']];
    this.setHelpUrl(Blockly.Msg.TEXT_CHANGECASE_HELPURL);
    this.setColours('#00aa00', '#007a00');
    this.setOutput(true, 'String');
    this.appendValueInput('TEXT')
        .setCheck('String')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'CASE');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.TEXT_CHANGECASE_TOOLTIP);
  }
};

Blockly.Blocks['text_trim'] = {
  /**
   * Block for trimming spaces.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.TEXT_TRIM_OPERATOR_BOTH, 'BOTH'],
         [Blockly.Msg.TEXT_TRIM_OPERATOR_LEFT, 'LEFT'],
         [Blockly.Msg.TEXT_TRIM_OPERATOR_RIGHT, 'RIGHT']];
    this.setHelpUrl(Blockly.Msg.TEXT_TRIM_HELPURL);
    this.setColours('#00aa00', '#007a00');
    this.appendValueInput('TEXT')
        .setCheck('String')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'MODE');
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.TEXT_TRIM_TOOLTIP);
  }
};


Blockly.Blocks['text_replace'] = {
  /**
   * Block for replacing one string with another in a string
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_REPLACE_HELPURL);
    this.setColours('#00aa00', '#007a00');
    this.appendValueInput('FROM')
      .setCheck('String')
      .appendField('replace');
    this.appendValueInput('TO')
      .setCheck('String')
      .appendField('with');
    this.appendValueInput('TEXT')
      .setCheck('String')
      .appendField('in');
    this.setOutput(true, 'String');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.TEXT_REPLACE_TOOLTIP);
  }
};

Blockly.Blocks['text_count'] = {
  /**
   * Block for replacing one string with another in a string
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_COUNT_HELPURL);
    this.setColours('#00aa00', '#007a00');
    this.appendValueInput('SUB')
      .setCheck('String')
      .appendField('count');
    this.appendValueInput('TEXT')
      .setCheck('String')
      .appendField('in');
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.TEXT_COUNT_TOOLTIP);
  }
};

Blockly.Blocks['text_split'] = {
  /**
   * Block for replacing one string with another in a string
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_SPLIT_HELPURL);
    this.setColours(Blockly.Colours.LIST_MAIN, Blockly.Colours.LIST_TRIM);
    this.setOutput(true, 'Array');
    this.interpolateMsg(Blockly.Msg.TEXT_SPLIT_TITLE,
                        ['TEXT', 'String', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setTooltip(Blockly.Msg.TEXT_SPLIT_TOOLTIP);
    this.setInputsInline(true);
  }
};

Blockly.Blocks['text_split_on'] = {
  /**
   * Block for replacing one string with another in a string
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_SPLIT_HELPURL);
    this.setColours(Blockly.Colours.LIST_MAIN, Blockly.Colours.LIST_TRIM);
    this.setOutput(true, 'Array');
    this.interpolateMsg(Blockly.Msg.TEXT_SPLIT_ON_TITLE,
                        ['TEXT', 'String', Blockly.ALIGN_RIGHT],
                        ['SEP', 'String', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setTooltip(Blockly.Msg.TEXT_SPLIT_ON_TOOLTIP);
    this.setInputsInline(true);
  }
};

Blockly.Blocks['text_reverse'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_REVERSE_HELPURL);
    this.setColours('#00aa00', '#007a00');
    this.setOutput(true, 'String');
    this.appendValueInput('VALUE')
        .setCheck('String')
      .appendField('reverse');
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.TEXT_REVERSE_TOOLTIP);
  }
};
