'use client';

import React, { useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * Monaco 代码编辑器组件
 */
export function MonacoEditor() {
  const { code, setCode, isExecuting, hasErrors, errorMessage, setError, clearError } =
    useEditorStore();

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      clearError();
    }
  }, [setCode, clearError]);

  const handleRun = useCallback(() => {
    // TODO: 实现代码执行逻辑
    console.log('Running code:', code);
  }, [code]);

  const handleReset = useCallback(() => {
    // TODO: 重置编辑器
    console.log('Reset editor');
  }, []);

  return (
    <Card className="flex flex-col h-full">
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="flex gap-2">
          <Button
            onClick={handleRun}
            disabled={isExecuting}
            size="sm"
            className="gap-2"
          >
            {isExecuting ? (
              <>
                <span className="animate-spin">⏳</span>
                运行中...
              </>
            ) : (
              <>
                <span>▶</span>
                运行
              </>
            )}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            disabled={isExecuting}
          >
            重置
          </Button>
        </div>

        {hasErrors && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* 编辑器 */}
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={handleEditorChange}
          theme="vs-light"
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            suggestOnTriggerCharacters: true,
          }}
        />
      </div>
    </Card>
  );
}
