"use client"
import { useState } from 'react';
import { usePortStore } from '@/shared/api/portStore';
import { useFstore } from '@/shared/api/fStore';
import Button from '@/shared/ui/button/Button';
import Input from '@/shared/ui/input/Input';
import styles from './styles.module.css';

const PortManager = () => {
  const { ports, createPort, deletePort, updatePort } = usePortStore();
  const { findItem } = useFstore();
  const [newPort, setNewPort] = useState({
    port: 3000,
    title: '',
    htmlPath: '',
    cssPath: '',
    jsPath: ''
  });
  const [editingPort, setEditingPort] = useState<number | null>(null);

  const validateFile = (path: string): boolean => {
    const file = findItem(path);
    console.log(file);
    
    return !!file && file.type === 'file';
  };

  const handleCreatePort = () => {
    if (!newPort.title || !newPort.htmlPath || !newPort.cssPath || !newPort.jsPath) {
      alert('Please fill all fields');
      return;
    }

    if (!validateFile(newPort.htmlPath) || !validateFile(newPort.cssPath) || !validateFile(newPort.jsPath)) {
      alert('One or more file paths are invalid');
      return;
    }

    createPort(newPort.port, newPort.title, newPort.htmlPath, newPort.cssPath, newPort.jsPath);
    setNewPort({
      port: newPort.port + 1,
      title: '',
      htmlPath: '',
      cssPath: '',
      jsPath: ''
    });
  };

  const handleUpdatePort = () => {
    if (!editingPort) return;
    
    updatePort(editingPort, {
      title: newPort.title,
      htmlPath: newPort.htmlPath,
      cssPath: newPort.cssPath,
      jsPath: newPort.jsPath
    });
    
    setEditingPort(null);
    setNewPort({
      port: newPort.port + 1,
      title: '',
      htmlPath: '',
      cssPath: '',
      jsPath: ''
    });
  };

  const startEditing = (port: number) => {
    const portData = ports[port];
    if (!portData) return;
    
    setEditingPort(port);
    setNewPort({
      port,
      title: portData.title,
      htmlPath: portData.htmlPath,
      cssPath: portData.cssPath,
      jsPath: portData.jsPath
    });
  };

  return (
    <div className={styles.portManager}>
      <h2>Port Management</h2>
      
      <div className={styles.portForm}>
        <Input
          label="Port Number"
          value={newPort.port}
          onChange={(e) => setNewPort({...newPort, port: parseInt(e.target.value) || 0})}
        />
        <Input
          label="Title"
          value={newPort.title}
          onChange={(e) => setNewPort({...newPort, title: e.target.value})}
        />
        <Input
          label="HTML File Path"
          value={newPort.htmlPath}
          onChange={(e) => setNewPort({...newPort, htmlPath: e.target.value})}
        />
        <Input
          label="CSS File Path"
          value={newPort.cssPath}
          onChange={(e) => setNewPort({...newPort, cssPath: e.target.value})}
        />
        <Input
          label="JS File Path"
          value={newPort.jsPath}
          onChange={(e) => setNewPort({...newPort, jsPath: e.target.value})}
        />
        
        {editingPort ? (
          <div className={styles.formButtons}>
            <Button text="Update Port" onClick={handleUpdatePort} />
            <Button text="Cancel" onClick={() => setEditingPort(null)} />
          </div>
        ) : (
          <Button text="Create Port" onClick={handleCreatePort} />
        )}
      </div>
      
      <div className={styles.portList}>
        <h3>Active Ports</h3>
        {Object.values(ports).map(port => (
          <div key={port.port} className={styles.portItem}>
            <div className={styles.portInfo}>
              <span className={styles.portNumber}>Port: {port.port}</span>
              <span className={styles.portTitle}>{port.title}</span>
            </div>
            <div className={styles.portActions}>
              <Button text="Edit" small onClick={() => startEditing(port.port)} />
              <Button text="Delete" small onClick={() => deletePort(port.port)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortManager;