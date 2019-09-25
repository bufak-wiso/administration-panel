import React, { Component } from 'react';
import {
    CardBody,
    Row,
    Col,
    FormGroup,
    Label,
    Input,
} from 'reactstrap'

class DetailsBody extends Component {
    renderFormGroup(property) {
        const { disabled, object } = this.props;
        switch(property.type) {
            case 'text':
                return (
                    <FormGroup>
                        <Label key={property.id + 'label'} for={property.id}>{property.name}</Label>
                        <Input
                            key={property.id}
                            type="text"
                            disabled={disabled}
                            id={property.id}
                            value={object[property.id] || ''}
                            onChange={e => this.props.onChange(property.id, e.currentTarget.value)}
                        />
                    </FormGroup>
                );
            case 'textarea':
                return (
                    <FormGroup>
                        <Label key={property.id + 'label'} for={property.id}>{property.name}</Label>
                        <Input
                            key={property.id}
                            type="textarea"
                            disabled={disabled}
                            id={property.id}
                            value={object[property.id] || ''}
                            onChange={e => this.props.onChange(property.id, e.currentTarget.value)}
                        />
                    </FormGroup>  
                )
            case 'number':
                return (
                    <FormGroup>
                        <Label key={property.id + 'label'} for={property.id}>{property.name}</Label>
                        <Input
                            key={property.id}
                            type="number"
                            disabled={disabled}
                            id={property.id}
                            value={object[property.id] || 0}
                            onChange={e => this.props.onChange(property.id, e.currentTarget.value)}
                            min={property.min}
                            max={property.max}
                        />
                    </FormGroup>  
                )
            case 'datetime-local':
                return (
                    <FormGroup>
                        <Label key={property.id + 'label'} for={property.id}>{property.name}</Label>
                        <Input
                            key={property.id}
                            type="datetime-local"
                            disabled={disabled}
                            id={property.id}
                            value={object[property.id]}
                            onChange={e => this.props.onChange(property.id, e.currentTarget.value)}
                            min={property.min}
                            max={property.max}
                        />
                    </FormGroup>  
                )
            case 'select':
                return (
                    <FormGroup>
                        <Label key={property.id + 'label'} for={property.id}>{property.name}</Label>
                        <Input
                            key={property.id}
                            type="select"
                            disabled={disabled}
                            id={property.id}
                            value={object[property.id]}
                            onChange={e => this.props.onChange(property.id, e.currentTarget.value)}
                        >
                            { property.options.map(x => <option key={property.id + x.name} value={x.value}>{x.name}</option>)}
                        </Input>
                    </FormGroup>  
                )
            case 'custom':
                return property.component
            default:
                return null
        }
    }

    render() {
        return (
            <CardBody>
                <Row>
                { this.props.properties.map(property =>
                    <Col key={property.id+'col'} md={property.md || 6} xs={property.xs || 12} xl={property.xl || 6}>
                        { this.renderFormGroup(property)}
                    </Col>
                )}
                </Row>
            </CardBody>
        )
    }
}
  
export default DetailsBody;