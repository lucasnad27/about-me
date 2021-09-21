import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Timeline from 'components/ui/Timeline';
import Container from 'components/ui/Container';
import TitleSection from 'components/ui/TitleSection';
import FormatHtml from 'components/utils/FormatHtml';

const Volunteer = () => {
  const { markdownRemark, allMarkdownRemark } = useStaticQuery(graphql`
    query {
      markdownRemark(frontmatter: { category: { eq: "volunteer section" } }) {
        frontmatter {
          title
          subtitle
        }
      }
      allMarkdownRemark(
        filter: { frontmatter: { category: { eq: "volunteer" } } }
        sort: { order: DESC, fields: frontmatter___order }
      ) {
        edges {
          node {
            id
            html
            frontmatter {
              company
              startDate
              endDate
              role
            }
          }
        }
      }
    }
  `);

  const sectionTitle = markdownRemark.frontmatter;
  const volunteer = allMarkdownRemark.edges;

  return (
    <Container section>
      <TitleSection title={sectionTitle.title} subtitle={sectionTitle.subtitle} />

      {volunteer.map((item) => {
        const {
          id,
          html,
          frontmatter: { company, role, startDate, endDate }
        } = item.node;

        return (
          <Timeline
            key={id}
            title={company}
            subtitle={role}
            content={<FormatHtml content={html} />}
            startDate={startDate}
            endDate={endDate}
          />
        );
      })}
    </Container>
  );
};

export default Volunteer;
