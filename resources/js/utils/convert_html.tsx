import { createEditor, LexicalEditor } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';

export default function convertEditorStateToHtml(serializedEditorState: string): string {
  try {
    const editor: LexicalEditor = createEditor({
      // konfigurasi minimalnya: nodes yang kamu pakai, tema, onError, dsb
      // Jika kamu punya custom nodes / theme, masukkan di sini agar parse-nya sesuai
    });

    const editorState = editor.parseEditorState(serializedEditorState);
    editor.setEditorState(editorState);

    let html = '';
    editor.update(() => {
      html = $generateHtmlFromNodes(editor, null);
    });

    return html;
  } catch (e) {
    console.warn('Failed to convert editor state to HTML:', e);
    return '<p>(Konten tidak dapat ditampilkan)</p>';
  }
}