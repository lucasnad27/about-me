import React from 'react';
import RehypeReact from "rehype-react"
import { graphql } from 'gatsby';
import Link from 'gatsby-link';

import Layout from 'components/Layout';
import SEO from 'components/SEO';
import Container from 'components/ui/Container';
import TitleSection from 'components/ui/TitleSection';

import * as Styled from './styles';

const renderAst = new RehypeReact({
  createElement: React.createElement,
  components: {
    h1: Styled.SectionHeader,
    h2: Styled.SubsectionHeader,
    h3: Styled.MiscHeader,
    p: Styled.Paragraph,
    ol: Styled.OrderedList,
    ul: Styled.UnorderedList,
    blockquote: Styled.Blockquote,
  },
}).Compiler;

const BlogPost = ({ data, pageContext }) => {
  const post = data.markdownRemark;
  const { previous, next } = pageContext;

  return (
    <Layout>
      <SEO title={post.frontmatter.title} />
      <Container section>
        <TitleSection title={post.frontmatter.date} subtitle={post.frontmatter.title} />
        {renderAst(post.htmlAst)}
        <Styled.Links>
          <span>
            {previous && (
              <Link to={previous.fields.slug} rel="previous">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </span>
          <span>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </span>
        </Styled.Links>
      </Container>
    </Layout>
  );
};

export default BlogPost;

export const query = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      htmlAst
      frontmatter {
        title
        date(formatString: "MMM DD, YYYY")
      }
    }
  }
`;
