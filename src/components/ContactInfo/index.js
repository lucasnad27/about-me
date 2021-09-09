
import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Container from 'components/ui/Container';
import Button from 'components/ui/Button';
import TitleSection from 'components/ui/TitleSection';

import * as Styled from './styles';

const ContactInfo = () => {
  const { markdownRemark } = useStaticQuery(graphql`
    query {
      markdownRemark(frontmatter: { category: { eq: "contact section" } }) {
        frontmatter {
          title
          subtitle
          namePlaceholder
          emailPlaceholder
          submitPlaceholder
          messagePlaceHolder
        }
      }
    }
  `);

  const contactInfo = markdownRemark.frontmatter;

  return (
    <Styled.ContactInfo>
      <Container section>
        <TitleSection title={contactInfo.title} subtitle={contactInfo.subtitle} center />
        <Styled.Form name="contact_me" netlify-honeypot="bot-field" method="post" data-netlify="true">
          <input type="hidden" name="bot-field" />
          <Styled.Input type="text" placeholder={contactInfo.namePlaceholder} />
          <Styled.Input type="email" placeholder={contactInfo.emailPlaceholder} />
          <Styled.TextArea name="message" placeholder={contactInfo.messagePlaceHolder} />
          <Button type="submit" primary block>
            {contactInfo.submitPlaceholder}
          </Button>
        </Styled.Form>
      </Container>
    </Styled.ContactInfo>
  );
};

export default ContactInfo;
