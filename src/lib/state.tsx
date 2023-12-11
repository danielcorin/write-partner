"use client"

import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { ApplicationState } from '@/types/state';
import { Message } from '@/types/message'

export const StateContext = createContext<any>(null);

export const StateProvider: React.FC<{
  reducer: React.Reducer<any, any>,
  initialState: any,
  children: React.ReactNode
}> = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

StateProvider.propTypes = {
  /**
   * @return {React.Node}
   */
  children: PropTypes.node.isRequired,

  /**
   * Object containing initial state value.
   */
  initialState: PropTypes.shape({}).isRequired,

  /**
   *
   * @param {object} state
   * @param {object} action
   */
  reducer: PropTypes.func.isRequired
};

export const getState = () => useContext(StateContext);

export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'setMessages':
      return {
        ...state,
        messages: action.messages,
      }
    case 'setDocument':
      return {
        ...state,
        document: action.document,
      }
    case 'setProposedDocument':
      return {
        ...state,
        proposedDocument: action.document,
      }
    default:
      return state
  }
}

const document: string = `# Vision for a Text Sculpting Tool

## Introduction
I'm captivated by the idea of constructing documents in a non-traditional, more dynamic manner.
My aim is to conceptualize a tool that revolutionizes the way we create text, moving away from the conventional process of writing and refining sentences one by one.

## Concept Overview
Instead of the classic approach to writing, I envision a method akin to sculpting.
The tool I imagine would provide the capability to manipulate and form text in a way that is more organic and intuitive.
`

const proposedDocument = `# Vision for a Text Sculpting Tool

## Introduction
I am interested in building a tool that allows me to construct a document in a non-linear, dynamic fashion.
My motivation stems from the struggle of traditional writing where I often find myself restructuring and refining as I go, which disrupts the flow of ideas.

## Concept Overview
I have always found that I communicate best in conversation, where ideas flow naturally and can be refined afterward.
This revelation leads me to envision a tool that empowers me to build a document as if I were sculpting text.
Through it, I can organically develop and refine my ideas, much as a sculptor works with clay, without being constrained by the linearity of traditional writing.

## The Sculpting Process
The process begins with a rough outline, a collection of thoughts and concepts that serve as the raw material for the document.
As these ideas are placed on the canvas, they can be shaped, connected, and rearranged through an intuitive interface that responds to the creator's touch.
This tactile approach to text manipulation allows for a more immersive and engaging writing experience, one that mirrors the fluidity of thought.

## Collaboration and Iteration
Moreover, the tool facilitates collaboration, enabling multiple sculptors to work on the same piece, each contributing their unique perspective and expertise.
Iterations become a natural part of the creation process, with changes and refinements happening in real-time, allowing the document to evolve organically.
`;

export const initialState: ApplicationState = {
  messages: [
    {
      text: `Hello! How are you today? I hope you are doing well. It's such a beautiful day outside and I can't wait to
      go for a run later. I've been training for a marathon and it's been such a rewarding experience.`,
      username: 'bot',
      id: 1,
      timestamp: new Date((new Date()).getTime() - (60 * 60 * 1000)),
    },
    {
      text: `Great!`,
      username: 'user',
      id: 2,
      timestamp: new Date((new Date()).getTime() - (55 * 60 * 1000)),
    },
    {
      text: `Thanks`,
      username: 'bot',
      id: 3,
      timestamp: new Date((new Date()).getTime() - (53 * 60 * 1000)),
    }
  ] as Message[],
  document: document,
  proposedDocument: proposedDocument,
}
