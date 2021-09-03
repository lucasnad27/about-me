import styled from 'styled-components';
import tw from 'twin.macro';

export const ContactInfo = styled.section`
  ${tw`bg-gray-100 border-t border-indigo-100 mt-auto`};
`;

export const Form = styled.form`
  ${tw`flex flex-col items-center justify-center mx-auto mt-4`};
`;

export const Input = styled.input`
  ${tw`bg-white focus:outline-none focus:shadow-sm border border-gray-300 rounded-md py-2 px-4 block w-full appearance-none leading-normal mb-3`};
`;

export const TextArea = styled.textarea`
  ${tw`bg-white focus:outline-none focus:shadow-sm border border-gray-300 rounded-md py-2 px-4 block w-full appearance-none leading-normal mb-3`};
`;
