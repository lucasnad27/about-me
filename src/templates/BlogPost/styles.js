import styled from 'styled-components';
import tw from 'twin.macro';

export const Links = styled.div`
  ${tw`w-full flex justify-between mt-10`};
`;

export const SectionHeader = styled.h1`
  ${tw`text-4xl font-semibold text-indigo-900 mb-8 mt-8`};
`;

export const SubsectionHeader = styled.h2`
  ${tw`text-2xl font-semibold text-pink-500 mb-6 mt-6`};
`;

export const MiscHeader = styled.h3`
  ${tw`text-xl font-semibold text-indigo-900 mb-4 mt-4`};
`;

export const Paragraph = styled.p``;

export const OrderedList = styled.ol`list-disc`;

export const UnorderedList = styled.ul`list-disc`;

export const Blockquote = styled.blockquote`
    border-color: ${tw`border-indigo-900`}
    ${tw`mt-2 mb-4 relative p-4 text-xl italic border-l-4`}
`;
