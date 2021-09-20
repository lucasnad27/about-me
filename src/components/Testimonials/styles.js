import styled from 'styled-components';
import tw from 'twin.macro';

export const Testimonials = styled.div`
  ${tw`max-w-screen-sm mx-auto w-full px-0 sm:px-16 mb-4`};
`;

export const Testimonial = styled.div`
  ${tw`flex flex-col items-center text-center mt-4`};
`;

export const Image = styled.figure`
  ${tw`w-16 h-16 mx-auto border border-pink-500 rounded-full`};

  img {
    ${tw`border-4 border-white rounded-full`};
  }
`;

export const Name = styled.h1`
  ${tw`font-semibold mt-2`};
`;

export const Title = styled.p`
  ${tw`font-normal mt-0 mr-4 ml-4 mb-4 italic`};
`;
