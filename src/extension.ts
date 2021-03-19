import * as vscode from "vscode";

const symbolPairs = {
  "(": ")",
  "{": "}",
  "[": "]",
  '"': '"',
  "'": "'",
};

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("smartSelect.smartSelect", function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

	  smartSelect(editor);
      
      var text = editor.document.getText(getSelection(editor, 0, 4));

      vscode.window.showInformationMessage(text);
    })
  );
}

export function deactivate() {}

function smartSelect(editor: vscode.TextEditor) {
	const currentSelection = editor.selection;
	editor.selection = getSelection(editor, getStartIndex(editor, currentSelection), getEndIndex(editor, currentSelection));
}

function getStartIndex(editor: vscode.TextEditor, currentSelection: vscode.Selection): number {
	return 0;
}

function getEndIndex(editor: vscode.TextEditor, currentSelection: vscode.Selection): number {
	return 0;
}

function getSelection(editor: vscode.TextEditor, start: number, end: number): vscode.Selection {
  return new vscode.Selection(
    editor.document.positionAt(start),
    editor.document.positionAt(end)
  );
}
