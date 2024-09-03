import { createSlice } from '@reduxjs/toolkit';
import { SELLER_TYPE } from '../../common/constants/options';

const initialState = {
  seller_type: SELLER_TYPE.ALL,
  show: false
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setSellerType: (state, action) => {
      state.seller_type = action.payload;
    },
    toggleShow: (state, action) => {
      state.show = action.payload;
    },
    setAndClose: (state, action) => {
      if (Object.hasOwn(action.payload, 'seller_type')) {
        state.seller_type = action.payload.seller_type;
      }

      state.show = false;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setSellerType, toggleShow, setAndClose } = configSlice.actions;

export default configSlice.reducer;
