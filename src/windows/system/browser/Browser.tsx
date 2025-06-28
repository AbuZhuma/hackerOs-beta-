import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import { usePortStore } from '@/shared/api/portStore';
import { useFstore } from '@/shared/api/fStore';


interface PortBrowserProps {
  initialPort?: number;
}

const Browser: React.FC<PortBrowserProps> = ({ initialPort=5000 }) => {
  const {ports} = usePortStore()
  const [currentPort, setCurrentPort] = useState<number | null>(initialPort || null);
  const [searchPort, setSearchPort] = useState<string>(initialPort?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const {findItem} = useFstore()

  useEffect(() => {
    if (currentPort && ports[currentPort]) {
      loadPortContent(currentPort);
    } else if (currentPort !== null) {
      setError(`Port ${currentPort} not found`);
    }
  }, [currentPort, ports]);

  const loadPortContent = (port: number) => {
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      if (iframeRef.current && ports[port]) {
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        const { htmlPath, cssPath, jsPath } = ports[port];
        const htmlCode = findItem(htmlPath)
        const cssCode = findItem(cssPath)
        const jsCode = findItem(jsPath)
        if (doc) {
          try {
            doc.open();
            doc.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>${ports[port].title || `Port ${port}`}</title>
                  <style>${cssCode?.text}</style>
                </head>
                <body>
                  ${htmlCode?.text}
                  <script>${jsCode?.text}</script>
                </body>
              </html>
            `);
            doc.close();
          } catch (e) {
            setError(`Error loading port ${port}: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
      }
      setIsLoading(false);
    }, 300); 
  };

  const handlePortSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const port = parseInt(searchPort);
    if (!isNaN(port)) {
      setCurrentPort(port);
    } else {
      setError('Please enter a valid port number');
    }
  };

  const reloadPort = () => {
    if (currentPort) {
      loadPortContent(currentPort);
    }
  };

  const availablePorts = Object.keys(ports).map(Number);

  return (
    <div className={styles.browserContainer}>
      <div className={styles.browserHeader}>
        <form onSubmit={handlePortSearch} className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <span className={styles.searchLabel}>PORT://</span>
            <input
              type="text"
              value={searchPort}
              onChange={(e) => setSearchPort(e.target.value)}
              className={styles.searchInput}
              placeholder="Enter port number..."
              aria-label="Port search"
              list="availablePorts"
            />
            <button 
              type="submit" 
              className={styles.searchButton}
              aria-label="Search"
            >
              CONNECT
            </button>
            <button 
              type="button" 
              className={styles.reloadButton}
              onClick={reloadPort}
              aria-label="Reload"
            >
              <span className={styles.reloadIcon}>⟳</span>
            </button>
          </div>
          <datalist id="availablePorts">
            {availablePorts.map(port => (
              <option key={port} value={port} />
            ))}
          </datalist>
        </form>
        
        <div className={styles.cyberDeco}>
          <span className={styles.decoLine}></span>
          <span className={styles.decoGlow}></span>
        </div>
      </div>
      
      <div className={styles.browserContent}>
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}>
              <div className={styles.spinnerPart}></div>
              <div className={styles.spinnerPart}></div>
              <div className={styles.spinnerPart}></div>
            </div>
            <div className={styles.loadingText}>CONNECTING TO PORT {currentPort}...</div>
          </div>
        )}
        
        {error && (
          <div className={styles.errorScreen}>
            <div className={styles.errorIcon}>⚠</div>
            <div className={styles.errorMessage}>{error}</div>
            <div className={styles.errorHelp}>AVAILABLE PORTS: {availablePorts.join(', ')}</div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          className={styles.browserIframe}
          title={currentPort ? `Port ${currentPort}` : 'Port Browser'}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      
      <div className={styles.browserFooter}>
        <div className={styles.statusBar}>
          <span className={styles.statusText}>
            {currentPort 
              ? `PORT: ${currentPort}${ports[currentPort]?.title ? ` - ${ports[currentPort]?.title}` : ''}` 
              : 'NO PORT SELECTED'}
          </span>
          <span className={styles.cyberTag}>LOCAL NETWORK</span>
        </div>
      </div>
    </div>
  );
};

export default Browser;