import * as vscode from "vscode";

const editor: vscode.TextEditor = vscode.window.activeTextEditor!;

let symbolPairs = new Map();
symbolPairs.set("(", ")");
symbolPairs.set("{", "}");
symbolPairs.set("[", "]");
symbolPairs.set('"', '"');
symbolPairs.set("'", "'");

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("smartSelect.smartSelect", function () {
      if (!editor) {
        return;
      }
	    smartSelect();
    })
  );
}

export function deactivate() {}

function smartSelect() {
	editor.selection = select(getNewIndexes());
}

function getNewIndexes(): {start: number, end: number} {
  if (isInnerSelection()) {
    console.log('Is Inner Selection');
    return {start: editor.selection.start.character - 1, end: editor.selection.end.character + 1};
  }

  const newStartIndex: number = getNewStartIndex();
  const newEndIndex: number = getIndexOfMatchingSymbol(symbolPairs.get(getCharacterByIndex(newStartIndex - 1)));
  return {start: newStartIndex, end: newEndIndex};
}

function getNewStartIndex(): number {
  let startIndex: number = isOuterSelection() ? editor.selection.start.character - 1: editor.selection.start.character;

  while (startIndex > -1) {
    if (symbolPairs.get(getCharacterByIndex(startIndex))) {
      return startIndex + 1;
    }
    startIndex --;
  }
 
  return 0;
}

function getIndexOfMatchingSymbol(symbolToMatch: string): number {
  let endIndex: number = editor.selection.end.character;

  while (endIndex < editor.document.getText().length) {
    if (getCharacterByIndex(endIndex) === symbolToMatch) {
      return endIndex;
    }
    endIndex ++;
  } 

	return editor.document.getText().length;
}

function isInnerSelection(): Boolean {
  const startCharacter: String = getCharacterByIndex(editor.selection.start.character - 1);
  
  if (symbolPairs.get(startCharacter) === getCharacterByIndex(editor.selection.end.character)) {
    return true;
  }

  return false;
}

function isOuterSelection(): Boolean {
  const startCharacter: String = getCharacterByIndex(editor.selection.start.character);
  
  if (symbolPairs.get(startCharacter) === getCharacterByIndex(editor.selection.end.character - 1)) {
    return true;
  }

  return false;
}

function select(selection: {start: number, end: number}): vscode.Selection {
  return new vscode.Selection(
    editor.document.positionAt(selection.start),
    editor.document.positionAt(selection.end)
  );
}

function getCharacterByIndex(index: number): string {
  return editor.document.getText(new vscode.Selection(editor.document.positionAt(index), editor.document.positionAt(index + 1)));
}