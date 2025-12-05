import React, { useEffect, useRef, useState } from 'react';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { PromQLExtension } from '@prometheus-io/codemirror-promql';

const promQL = new PromQLExtension();

const mockFunctions = [
  { name: 'sum', type: 'aggregation', signature: 'sum(instant-vector)' },
  { name: 'sum_over_time', type: 'function', signature: 'sum_over_time(range-vector)' },
  { name: 'rate', type: 'function', signature: 'rate(range-vector)' },
  { name: 'histogram_sum', type: 'function', signature: 'histogram_sum(instant-vector)' },
  { name: 'avg', type: 'aggregation', signature: 'avg(instant-vector)' },
  { name: 'count', type: 'aggregation', signature: 'count(instant-vector)' },
  { name: 'min', type: 'aggregation', signature: 'min(instant-vector)' },
  { name: 'max', type: 'aggregation', signature: 'max(instant-vector)' },
  { name: 'by', type: 'keyword', signature: 'by' },
  { name: 'without', type: 'keyword', signature: 'without' },
];

interface PromQLEditorProps {
  prometheusUrl?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function PromQLEditor({ 
  prometheusUrl = 'http://localhost:9090',
  value = '',
  onChange 
}: PromQLEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [metrics, setMetrics] = useState<string[]>([]);
  const isUpdatingFromProp = useRef(false);

  // Fetch metrics from Prometheus API
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${prometheusUrl}/api/v1/label/__name__/values`);
        const data = await response.json();
        if (data.status === 'success') {
          setMetrics(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
  }, [prometheusUrl]);

  // Autocomplete function
  const promqlCompletions = async (context: CompletionContext) => {
    const word = context.matchBefore(/\w*/);
    if (!word || (word.from === word.to && !context.explicit)) return null;

    const options: any[] = [];

    // Add functions
    mockFunctions.forEach(func => {
      options.push({
        label: func.name,
        type: func.type,
        detail: func.type,
        info: func.signature
      });
    });

    // Add metrics
    metrics.forEach(metric => {
      options.push({
        label: metric,
        type: 'counter',
        detail: 'counter',
        info: 'counter'
      });
    });

    return {
      from: word.from,
      options: options.filter((opt: any) =>
        opt.label.toLowerCase().includes(word.text.toLowerCase())
      )
    };
  };

  // Initialize editor once
  useEffect(() => {
    if (!editorRef.current) return;

    const completionTheme = EditorView.theme({
      '.cm-tooltip-autocomplete': {
        backgroundColor: '#1e1e1e',
        border: '1px solid #333',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        fontFamily: 'Consolas, Monaco, monospace',
        fontSize: '13px',
        maxHeight: '400px',
        width: '600px',
      },
      '.cm-tooltip-autocomplete > ul > li': {
        padding: '6px 12px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
        backgroundColor: '#2d2d2d',
      },
      '.cm-completionLabel': {
        flex: '1',
      },
      '.cm-completionInfo': {
        color: '#858585',
        fontSize: '11px',
        fontStyle: 'italic',
        marginLeft: '12px',
        marginRight: '12px',
      },
      '.cm-completionDetail': {
        color: '#abb2bf',
        fontSize: '11px',
        marginLeft: 'auto',
        textAlign: 'right',
      },
      '.cm-content': {
        color: '#d4d4d4',
      },
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        vscodeDark,
        completionTheme,
        autocompletion({
          override: [promqlCompletions],
          activateOnTyping: true,
          maxRenderedOptions: 20,
        }),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange && !isUpdatingFromProp.current) {
            onChange(update.state.doc.toString());
          }
        }),
        promQL.asExtension()
      ]
    });

    const view = new EditorView({
      state,
      parent: editorRef.current
    });

    viewRef.current = view;

    return () => view.destroy();
  }, [metrics]); // Only reinitialize when metrics change

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (!viewRef.current) return;
    
    const currentValue = viewRef.current.state.doc.toString();
    if (currentValue !== value) {
      isUpdatingFromProp.current = true;
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: value
        }
      });
      isUpdatingFromProp.current = false;
    }
  }, [value]);

  return <div ref={editorRef} style={{ height: '100%' }} />;
}