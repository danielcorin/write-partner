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
    default:
      return state
  }
}

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
  document:  localStorage.getItem('write-partner.document') ?? "",
}
