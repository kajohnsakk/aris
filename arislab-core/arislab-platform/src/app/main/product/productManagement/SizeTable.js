import React, { Component } from 'react';
import styled from 'styled-components';

const Table = styled.div`
    background-color: rgb(250, 250, 250);
    width: 100%;
    padding: 1em;
    display: flex;
    justify-content: space-between;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;

    input {
        margin-bottom: .7em;
    }

    input:last-child {
        margin-bottom: 0;
    }
`

const Input = styled.input`
    text-align: center;
    width: 4em;
    border: 1px solid #e0e0e0;
    border-radius: 2px;
    font: 200 1.5rem "kanit", Arial;
    padding: 5px 1em;
    margin: 0;
`;

const Dummy = styled(Input)`
    background-color: rgb(0, 0, 0, 0);
    border: 1px solid rgb(0, 0, 0, 0);
`;

// const Hidden = styled.input`
//     width: 4em;
//     padding: 5px 1em;
//     margin: 0;
// `;

class SizeTable extends Component {
    render() {
        return (
            <Table>
                <Column>
                    <Dummy disabled></Dummy>
                    <Input></Input>
                    <Input></Input>
                    <Input></Input>
                </Column>
                <Column>
                    <Input></Input>
                    <Input></Input>
                    <Input></Input>
                    <Input></Input>
                </Column>
                <Column>
                    <Input></Input>
                    <Input></Input>
                    <Input></Input>
                    <Input></Input>
                </Column>
                <Column>
                    <Input></Input>
                    <Input></Input>
                    <Input></Input>
                    <Input></Input>
                </Column>
            </Table>        
        )
    }
}

export default SizeTable;