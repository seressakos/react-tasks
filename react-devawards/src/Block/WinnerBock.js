import React, { Component } from 'react';
import styled, {css} from 'styled-components';
import {Container} from '../Layout/Layout';
import {Flex} from '../Layout/Layout'

class WinnerBlock extends Component {
  constructor() {
    super();
    this.state = {
      years: [],
      currentYear: 0,
      nodeArray: [],
      categories: [],
      bestPortals: [],
    }
  }

  seturl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryCategory = urlParams.get('year');

    this.setState({currentYear : queryCategory});
  }

  getCardContent = () => {
    const {currentYear} = this.state;

    Promise.all([
      fetch(`http://devportalawards.docker.amazee.io/jsonapi/node/nominees?filter[field_year.name]=${currentYear}&include=field_site_image&fields[file--file]=uri`, {'method': 'GET'}),
    ])
      .then(values => Promise.all(values.map(value => value.json())))
      .then(data => {
        const categories = [...this.state.categories]
        const bestPortals = [...this.state.bestPortals]

        const nodeArray = [
          ...data[0]['data'].map((element, index) => {
            return {
              title: element['attributes']['title'].toString(),
              sitelink: element['attributes']['field_sitelink'][0]['uri'],
              imageurl: data[0]['included'][index]['attributes']['uri']['value'],
              category: element['relationships']['field_winner'].data.map(e => {
                let name;
                categories.map(category => {
                  if (e.id === category.categoryId) {
                  name = category.categoryName;
                  }
                })

                return name;
              }),
            }
          })
        ];

        data[0]['data'].map((element, index) => {
          bestPortals.forEach((portal) => {
            if (element['relationships']['field_best_portals']['data']) {
              if (portal.bestPortalId === element['relationships']['field_best_portals']['data']['id']) {
                nodeArray[index].bestPortal = portal.bestPortalName
              }
            }
          })
        });

        this.setState({nodeArray: nodeArray});
      })
  }

  componentDidMount() {
    this.seturl();

    Promise.all([
      fetch('http://devportalawards.docker.amazee.io/jsonapi/taxonomy_term/years', {'method': 'GET'}),
      fetch(`http://devportalawards.docker.amazee.io/jsonapi/taxonomy_term/winner_categoryes`, {'method': 'GET'}),
      fetch('http://devportalawards.docker.amazee.io/jsonapi/taxonomy_term/best_portals', {'method': 'GET'}),
    ])
      .then (values => Promise.all(values.map(value => value.json())))
      .then(data => {

        this.setState({years: [
            ...this.state.years,
            ...data[0]['data'].map((element, index) => {
               return element['attributes']['name'];
            })
          ].reverse()});

        this.setState((prevstate)=>({categories: [
            ...prevstate.categories,
            ...data[1]['data'].map(el => {
              return {
                categoryId: el['id'],
                categoryName: el['attributes']['name'],
              }
            })
          ]
        }));

        this.setState((prevstate)=>({bestPortals: [
            ...prevstate.bestPortals,
            ...data[2]['data'].map(el => {
              return {
                bestPortalId: el['id'],
                bestPortalName: el['attributes']['name'],
              }
            })
          ]
        }))

        this.setState({
          currentYear: this.state.currentYear ? this.state.currentYear : this.state.years[0]
        }, () => { this.getCardContent() });
      })
  };

  handleCurrentYear = (e) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('year', e.target.innerHTML);
    window.history.replaceState(
      null,
      document.title,
      `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`,
    )

    this.setState({
      currentYear:e.target.innerHTML
    }, () => { this.getCardContent() });
  }

  render() {
    return (
      <div>
        <Container>
          <Flex spaceBetween>
            {this.state.years.map((year, index) => {
              return <div className={year === this.state.currentYear ? "active" : "inactive"} onClick={(e)=>{this.handleCurrentYear(e)}} key={year}>{year}</div>
            })}
          </Flex>
        </Container>
        <div>
          {this.state.nodeArray.map((node => {
            return node.bestPortal ? <h1>{node.bestPortal}</h1> : null
          }))}
        </div>
        <div>
          {this.state.nodeArray.map((node, index) => {
            return <div key={node.title}>
              <div>
                <img src={node.imageurl}/>
              </div>
              <h1>{node.title}</h1>
              {this.state.nodeArray[index].category.map(category => {
                return <h2 key={category}>{category}</h2>
              })}
            </div>
          })}
        </div>
      </div>
    )
  }
}

export default WinnerBlock;
