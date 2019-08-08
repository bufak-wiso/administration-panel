import Page from 'components/Page';
import React from 'react';
import { connect } from 'react-redux';
import { Card, 
    CardHeader, CardBody, Button, Row, Col, FormGroup, Label, Input
} from 'reactstrap'
import Select from 'react-select';
// import {Link} from 'react-router-dom';
import PageSpinner from '../components/PageSpinner';
// import { MdCheckCircle, MdHighlightOff } from 'react-icons/md';
//import AuthActions from '../redux/authRedux';
import ConferenceActions from '../redux/conferenceRedux';
import CouncilActions from '../redux/councilRedux';

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          user : {
              uid: "132098130219",
                name:"Daniel",
                surname:"Korsmeier",
                birthday:"1991-08-14",
                email:"bufak@dkorsmeier.de",
                councilID:"160",
                address:"33175;Bad Lippspringe;Arminiuspark 12c",
                sex:"Männlich",
                note:"string",
                invalid:false,
                isSuperAdmin:false
          },
          zipcode: "",
          city: "",
          street: "",
          editing: false
        }
    }
  componentDidMount() {
    this.props.getCouncilList()
    //this.props.getUser();
    if (this.state.user) 
    {
      var addressarray = this.cutAddress(this.state.user.address);
      this.setState({ zipcode: addressarray[0], city: addressarray[1], street: addressarray[2]});
    }
  }

  onCancel() {
    this.setState({
      editing: false,
      //application: this.props.application
    })
  }

  onSave() {
    this.setState({
      editing: false
    })
    this.setState({user: {...this.state.user, address: this.state.zipcode + ";" + this.state.city + ";" + this.state.street}})
    //this.props.uploadApplication(this.state.application)
  }

  cutAddress(address){
      const addressArray = address.split(';')
      return addressArray
  }

  renderUserCard() {
    const { user, editing, street, zipcode, city } = this.state;
    const { councilList } = this.props;
    var councilOptions = [];
    if (councilList){
      councilList.forEach(cl => {
        councilOptions.push({value: cl.councilID.toString(),label: cl.name + ", " + cl.university})
      })
    }

    return(
        <Card>
            <CardHeader>
                  <Row style={{ justifyContent: 'space-between'}}>
                  {/* { application.user.surname + ' ' + application.user.name} */}
                  <div>
                  { !editing && <Button onClick={() => this.setState({ editing: true})}>Bearbeiten</Button>}
                  { editing && <Button style={{ marginRight: 10}} onClick={() => this.onCancel()}>Abbrechen</Button>}
                  { editing && <Button onClick={() => this.onSave()}>Speichern</Button>}
                  </div>
                  </Row>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xs="12" md="6">
                            <FormGroup>
                            <Label for="status">Geschlecht</Label>
                            <Input
                                type="select"
                                id="name"
                                disabled={!this.state.editing}
                                value={ user.sex}
                                onChange={(e) => this.setState({ user: {...this.state.user, sex: e.currentTarget.value}})}
                                >
                                    <option>Männlich</option>
                                    <option>Weiblich</option>
                                    <option>keine Angabe</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                            <Label for="status">Vorname</Label>
                            <Input
                                type="text"
                                id="name"
                                disabled={!this.state.editing}
                                value={ user.name}
                                onChange={(e) => this.setState({ user: {...this.state.user, name: e.currentTarget.value}})}
                                >
                                </Input>
                            </FormGroup>
                            <FormGroup>
                            <Label for="status">Nachname</Label>
                            <Input
                                type="text"
                                id="surname"
                                disabled={!this.state.editing}
                                value={ user.surname}
                                onChange={(e) => this.setState({ user: {...this.state.user, surname: e.currentTarget.value}})}
                                >
                                </Input>
                            </FormGroup>
                            <FormGroup>
                            <Label for="status">Straße, Hausnummer</Label>
                            <Input
                                type="text"
                                id="surname"
                                disabled={!this.state.editing}
                                value={ street }
                                onChange={(e) => this.setState({ street: e.currentTarget.value})}
                                >
                                </Input>
                            </FormGroup>
                          <Row>
                            <Col xs="12" md="6">
                              <FormGroup>
                                <Label for="status">PLZ</Label>
                                <Input
                                    type="text"
                                    id="surname"
                                    disabled={!this.state.editing}
                                    value={ zipcode }
                                    onChange={(e) => this.setState({ zipcode: e.currentTarget.value})}
                                    >
                                    </Input>
                              </FormGroup>
                            </Col>
                            <Col xs="12" md="6">
                              <FormGroup>
                                <Label for="status">Stadt</Label>
                                <Input
                                    type="text"
                                    id="surname"
                                    disabled={!this.state.editing}
                                    value={ city }
                                    onChange={(e) => this.setState({ city: e.currentTarget.value})}
                                    >
                                    </Input>
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs="12" md="6">
                            <FormGroup>
                            <Label for="status">E-Mail</Label>
                            <Input
                                type="text"
                                id="email"
                                disabled={!this.state.editing}
                                value={ user.email}
                                onChange={(e) => this.setState({ user: {...this.state.user, email: e.currentTarget.value}})}
                                >
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="Geburtsdatum">Geburtsdatum</Label>
                                <Input
                                    type="date"
                                    name="date"
                                    disabled={!this.state.editing}
                                    value={user.birthday}
                                    onChange={e => this.setState({user: { ...this.state.user, birthday: e.currentTarget.value}})}
                                    placeholder="date placeholder"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label> Fachschaftsrat</Label>
                                <Select 
                                isDisabled={!this.state.editing}
                                onChange={e => this.setState({ user: { ...this.state.user, councilID: e.value }})}
                                defaultValue={councilOptions && councilOptions.find( council => council.value === user.councilID)}
                                options = {councilOptions} />
                            </FormGroup>
                        </Col>
                    </Row>
                </CardBody>
            
        </Card>
        
    )
  }

  render() {
    const { conference} = this.props;
    
     if (!conference) {
       return (
         <PageSpinner color="primary" />
       );
     }
    return (
      <Page
        // className="DashboardPage"
        title={conference ? 'BuFaK ' + conference.name : 'Startseite'}
      >
        { this.renderUserCard() }
     </Page>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    conference: state.conference.conference,
    council: state.council.council,
    councilList: state.council.councilList,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    //getUser: () => dispatch(AuthActions.getUser()),
    getConference: () => dispatch(ConferenceActions.getConference()),
    getCouncilList: () => dispatch(CouncilActions.getCouncilList())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
