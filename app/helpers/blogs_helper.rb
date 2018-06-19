module BlogsHelper
  def render_highlight_content(blog,query_string)
    excerpt_cont = excerpt(blog.content, query_string, radius: 300)
    excerpt_cont = excerpt(blog.title, query_string, radius: 100)
    highlight(excerpt_cont, query_string)
  end
end
