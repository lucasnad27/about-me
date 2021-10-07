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

export const OrderedList = styled.ol`
    ${tw`list-decimal ml-8 mt-2 mb-2`}
`;

export const UnorderedList = styled.ul`
    ${tw`list-disc ml-8 mt-2 mb-2`}
`;

export const Blockquote = styled.blockquote`
    border-color: ${tw`border-indigo-900`}
    ${tw`mt-2 mb-4 relative p-4 italic border-l-4 bg-indigo-200`}
`;

export const Infoblock = styled.div`
    border-color: ${tw`border-pink-500`}
    ${tw`mt-2 mb-4 relative p-4 italic border-l-4 bg-pink-200 not-italic`}
`;

export const HighlightMark = styled.mark`
    ${tw`bg-pink-200 text-indigo-900`}
`;
