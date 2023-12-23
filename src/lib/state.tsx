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

export const useStore = () => useContext(StateContext);

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
    case 'setLoadingResults':
      return {
        ...state,
        loadingResults: action.loadingResults,
      }
    default:
      return state
  }
}

const document: string = ``
const proposedDocument = ``;

export const initialState: ApplicationState = {
  messages: [] as Message[],
  document: document,
  proposedDocument: proposedDocument,
  loadingResults: false,
}
