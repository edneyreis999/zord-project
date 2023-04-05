import * as Styled from './styles';
import { useState } from 'react';
import axios from 'axios';

export type FileImporterProps = {
  title?: string;
};

export const FileImporter = ({ title }: FileImporterProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        console.log('Enviando arquivo...');
        console.log(formData);
        const response = await axios.post('/api/import/file', formData);
        console.log(response);
        // Lidar com a resposta da API
      } catch (error) {
        // Lidar com erros
      }
    }
  };

  return (
    <Styled.Wrapper>
      <h1>Chapter Importer</h1>
      <p>{title}</p>
      <Styled.StyledInput type="file" onChange={handleFileChange} />
      <Styled.StyledButton onClick={handleFileUpload}>
        Enviar
      </Styled.StyledButton>
    </Styled.Wrapper>
  );
};
