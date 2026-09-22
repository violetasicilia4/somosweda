import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // If it's a MetaMask or extension error, ignore it
    if (error.message?.includes('MetaMask') || error.message?.includes('ethereum')) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error.message?.includes('MetaMask') || error.message?.includes('ethereum')) {
      return;
    }
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 text-neutral-800">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold mb-2 font-display text-neutral-900">
              Algo no salió como esperábamos
            </h2>
            <p className="text-sm text-neutral-600 mb-6">
              Ocurrió un error inesperado al cargar la vista. Podés recargar la aplicación para continuar organizando tu boda.
            </p>
            <button
              id="reload-app-button"
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Recargar aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
