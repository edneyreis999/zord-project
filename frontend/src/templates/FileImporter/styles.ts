import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => theme.colors.secondaryColor};
  width: 300px;
`;

export const StyledInput = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ced4da;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: ${({ theme }) => theme.colors.secondaryColor};
  outline: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &:focus {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

export const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #007bff;
  font-size: 1rem;
  line-height: 1.5;
  background-color: ${({ theme }) => theme.colors.primaryColor};
  background-color: #007bff;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, color 0.15s ease-in-out;
  &:hover {
    background-color: #0069d9;
    border-color: #0062cc;
  }
`;
