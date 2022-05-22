import React from "react";
import {useEffect} from "react";
import {useState} from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
`

const Facet = styled.div`
  flex-basis: 30%
`

const Nodes = styled.div`
  flex-basis: 70%
`

const App= () => {
  const [filters, setFilters] = useState([]);
  const [node, setNode] = useState([]);
  const [searchText, setSearchText] = useState('')

  const handleFilterClick = (e) => {
    e.preventDefault()
    fetch(`http://backend.fodorzsana.hu/jsonapi/node/guides?filter[field_guides.id]=${e.target.id}`, {'method' : 'GET'})
        .then((data) => data.json())
        .then(({data}) => {
          let node = [...[], ...data.map((node) => {
            return {
              'title': node.attributes.title,
              'body': node.attributes.body.value,
            }
          })];

          setNode(node);
        })
  }

  const inputHandler = (e) => {
    setSearchText(e.target.value);
  }

  const submitHandler = (e) => {
    e.preventDefault();
    fetch(`http://backend.fodorzsana.hu/jsonapi/node/guides?
       filter[search-or][group][conjunction]=OR&
       filter[body-filter][condition][path]=body.value&
       filter[body-filter][condition][operator]=CONTAINS&
       filter[body-filter][condition][value]=${searchText}&
       filter[body-filter][condition][memberOf]=search-or&
       filter[title][operator]=CONTAINS&
       filter[title][value]=${searchText}&
       filter[title][condition][memberOf]=search-or`, {'method' : 'GET'})
        .then((data) => data.json())
        .then(({data}) => {
          let node = [...[], ...data.map((node) => {
            return {
              'title': node.attributes.title,
              'body': node.attributes.body.value,
            }
          })];

          setNode(node);
        })
  }

  const handleSubfilterclick = (e) => {
    console.log(e.target.innerHTML)
    fetch(`http://backend.fodorzsana.hu/jsonapi/node/guides?filter[title]=${e.target.innerHTML}`, {'method' : 'GET'})
        .then((data) => data.json())
        .then(({data}) => {
          let node = [...[], ...data.map((node) => {
            return {
              'title': node.attributes.title,
              'body': node.attributes.body.value,
            }
          })];

          setNode(node);
        })
  }

  useEffect(() => {
    fetch('http://backend.fodorzsana.hu/jsonapi/node/guides?include=field_guides', {'method' : 'GET'})
        .then((data) => data.json())
        .then(({data, included}) => {
          let filters = [];
          let node = [...[], ...data.map((node) => {
            return {
              'title': node.attributes.title,
              'body': node.attributes.body.value,
            }
          })];

          included.map((element) => {
            let childFilters = data.filter(d => d.relationships.field_guides.data.id === element.id).map((el) => {
              return el.attributes.title;
            });

            filters.push({
              'name': element.attributes.name,
              'id': element.id,
              'childfilters': childFilters,
            })
          });

          setNode(node);
          setFilters(filters);
        })



  }, []);

  return (
    <div>
      <div className="faq-search-block">
        <form action="search" className="search-form form">
          <div className="form-wrapper">
            <input
                type="text"
                value={searchText}
                placeholder="Enter keyword"
                id="search"
                name="search"
                onChange={(e) => {
                  return inputHandler(e);
                }}
            />
            <div className="submit-wrapper">
              <input
                  type="submit"
                  name="submit"
                  value="Search"
                  className="button button--primary"
                  onClick={(e) => {
                    return submitHandler(e);
                  }}
              />
            </div>
          </div>
        </form>
      </div>
      <Wrapper>
        <Facet>
          {filters.map((filter) => {
            return <div>
              <h2 id={filter.id} onClick={(e) => handleFilterClick(e)}>{filter.name}</h2>
              <div>
                {filter.childfilters.map((child)=> {
                  return <p onClick={(e) => handleSubfilterclick(e)}>{child}</p>
                })}
              </div>
            </div>
          })}
        </Facet>
        <Nodes>
          {node.map((n)=> {
            return <div>
              <h2>{n.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: n.body }}></div>
            </div>
          })}
        </Nodes>
      </Wrapper>
    </div>

  );
}

export default App;
