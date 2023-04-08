/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/contexts/DmsdContext/DmsdContext.ts":
/*!*************************************************!*\
  !*** ./src/contexts/DmsdContext/DmsdContext.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\nconst DmsdContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({\n    state: null,\n    dispatch: null\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DmsdContext);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGV4dHMvRG1zZENvbnRleHQvRG1zZENvbnRleHQudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXNDO0FBT3RDLE1BQU1DLGNBQWNELG9EQUFhQSxDQUFrQjtJQUNqREUsT0FBTyxJQUFJO0lBQ1hDLFVBQVUsSUFBSTtBQUNoQjtBQUVBLGlFQUFlRixXQUFXQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZG1zZC8uL3NyYy9jb250ZXh0cy9EbXNkQ29udGV4dC9EbXNkQ29udGV4dC50cz82MDJkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUNvbnRleHQgfSBmcm9tIFwicmVhY3RcIjtcblxudHlwZSBEbXNkQ29udGV4dFR5cGUgPSB7XG4gIHN0YXRlOiBhbnk7XG4gIGRpc3BhdGNoOiBhbnk7XG59O1xuXG5jb25zdCBEbXNkQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8RG1zZENvbnRleHRUeXBlPih7XG4gIHN0YXRlOiBudWxsLFxuICBkaXNwYXRjaDogbnVsbCxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBEbXNkQ29udGV4dDtcbiJdLCJuYW1lcyI6WyJjcmVhdGVDb250ZXh0IiwiRG1zZENvbnRleHQiLCJzdGF0ZSIsImRpc3BhdGNoIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/contexts/DmsdContext/DmsdContext.ts\n");

/***/ }),

/***/ "./src/contexts/DmsdContext/DmsdProvider.tsx":
/*!***************************************************!*\
  !*** ./src/contexts/DmsdContext/DmsdProvider.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state */ \"./src/contexts/DmsdContext/state.ts\");\n/* harmony import */ var _DmsdContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DmsdContext */ \"./src/contexts/DmsdContext/DmsdContext.ts\");\n\n\n\n\nfunction DmsdProvider({ children  }) {\n    const [state, dispatch] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useReducer)(_state__WEBPACK_IMPORTED_MODULE_2__.reducer, _state__WEBPACK_IMPORTED_MODULE_2__.initialState);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_DmsdContext__WEBPACK_IMPORTED_MODULE_3__[\"default\"].Provider, {\n        value: {\n            state,\n            dispatch\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/wassim/Projects/Solidity/Workspace/alyra-graded-projects/DMSD/src/contexts/DmsdContext/DmsdProvider.tsx\",\n        lineNumber: 13,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DmsdProvider);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGV4dHMvRG1zZENvbnRleHQvRG1zZFByb3ZpZGVyLnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUE4QztBQUNFO0FBQ1I7QUFNeEMsU0FBU0ksYUFBYSxFQUFFQyxTQUFRLEVBQVMsRUFBRTtJQUN6QyxNQUFNLENBQUNDLE9BQU9DLFNBQVMsR0FBR1AsaURBQVVBLENBQUNDLDJDQUFPQSxFQUFFQyxnREFBWUE7SUFFMUQscUJBQ0UsOERBQUNDLDZEQUFvQjtRQUNuQk0sT0FBTztZQUNMSDtZQUNBQztRQUNGO2tCQUVDRjs7Ozs7O0FBR1A7QUFFQSxpRUFBZUQsWUFBWUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Rtc2QvLi9zcmMvY29udGV4dHMvRG1zZENvbnRleHQvRG1zZFByb3ZpZGVyLnRzeD81MDRiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVJlZHVjZXIsIFJlYWN0Tm9kZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgcmVkdWNlciwgaW5pdGlhbFN0YXRlIH0gZnJvbSBcIi4vc3RhdGVcIjtcbmltcG9ydCBEbXNkQ29udGV4dCBmcm9tIFwiLi9EbXNkQ29udGV4dFwiO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBjaGlsZHJlbjogUmVhY3ROb2RlO1xufVxuXG5mdW5jdGlvbiBEbXNkUHJvdmlkZXIoeyBjaGlsZHJlbiB9OiBQcm9wcykge1xuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdGlhbFN0YXRlKTtcblxuICByZXR1cm4gKFxuICAgIDxEbXNkQ29udGV4dC5Qcm92aWRlclxuICAgICAgdmFsdWU9e3tcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIGRpc3BhdGNoLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9EbXNkQ29udGV4dC5Qcm92aWRlcj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgRG1zZFByb3ZpZGVyO1xuIl0sIm5hbWVzIjpbInVzZVJlZHVjZXIiLCJyZWR1Y2VyIiwiaW5pdGlhbFN0YXRlIiwiRG1zZENvbnRleHQiLCJEbXNkUHJvdmlkZXIiLCJjaGlsZHJlbiIsInN0YXRlIiwiZGlzcGF0Y2giLCJQcm92aWRlciIsInZhbHVlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/contexts/DmsdContext/DmsdProvider.tsx\n");

/***/ }),

/***/ "./src/contexts/DmsdContext/index.ts":
/*!*******************************************!*\
  !*** ./src/contexts/DmsdContext/index.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"DmsdContext\": () => (/* reexport safe */ _DmsdContext__WEBPACK_IMPORTED_MODULE_0__[\"default\"]),\n/* harmony export */   \"DmsdProvider\": () => (/* reexport safe */ _DmsdProvider__WEBPACK_IMPORTED_MODULE_1__[\"default\"]),\n/* harmony export */   \"useDmsd\": () => (/* reexport safe */ _useDmsd__WEBPACK_IMPORTED_MODULE_2__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _DmsdContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DmsdContext */ \"./src/contexts/DmsdContext/DmsdContext.ts\");\n/* harmony import */ var _DmsdProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DmsdProvider */ \"./src/contexts/DmsdContext/DmsdProvider.tsx\");\n/* harmony import */ var _useDmsd__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useDmsd */ \"./src/contexts/DmsdContext/useDmsd.ts\");\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./state */ \"./src/contexts/DmsdContext/state.ts\");\n/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};\n/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _state__WEBPACK_IMPORTED_MODULE_3__) if([\"default\",\"DmsdContext\",\"DmsdProvider\",\"useDmsd\"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _state__WEBPACK_IMPORTED_MODULE_3__[__WEBPACK_IMPORT_KEY__]\n/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);\n\n\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGV4dHMvRG1zZENvbnRleHQvaW5kZXgudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUF1RDtBQUNFO0FBQ1Y7QUFDdkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kbXNkLy4vc3JjL2NvbnRleHRzL0Rtc2RDb250ZXh0L2luZGV4LnRzPzMxYTEiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHsgZGVmYXVsdCBhcyBEbXNkQ29udGV4dCB9IGZyb20gXCIuL0Rtc2RDb250ZXh0XCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIERtc2RQcm92aWRlciB9IGZyb20gXCIuL0Rtc2RQcm92aWRlclwiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB1c2VEbXNkIH0gZnJvbSBcIi4vdXNlRG1zZFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vc3RhdGVcIjtcbiJdLCJuYW1lcyI6WyJkZWZhdWx0IiwiRG1zZENvbnRleHQiLCJEbXNkUHJvdmlkZXIiLCJ1c2VEbXNkIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/contexts/DmsdContext/index.ts\n");

/***/ }),

/***/ "./src/contexts/DmsdContext/state.ts":
/*!*******************************************!*\
  !*** ./src/contexts/DmsdContext/state.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"actions\": () => (/* binding */ actions),\n/* harmony export */   \"initialState\": () => (/* binding */ initialState),\n/* harmony export */   \"reducer\": () => (/* binding */ reducer)\n/* harmony export */ });\nconst actions = {\n    addUser: \"ADD_USER\"\n};\nconst initialState = {\n    user: null\n};\nconst reducer = (state, action)=>{\n    const { type , data , payload  } = action;\n    switch(type){\n        case actions.addUser:\n            {\n                return {\n                    ...state,\n                    user: payload\n                };\n            }\n        default:\n            throw new Error(\"Undefined reducer action type\");\n    }\n};\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGV4dHMvRG1zZENvbnRleHQvc3RhdGUudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBWUEsTUFBTUEsVUFBVTtJQUNkQyxTQUFTO0FBQ1g7QUFFQSxNQUFNQyxlQUFzQjtJQUMxQkMsTUFBTSxJQUFJO0FBQ1o7QUFFQSxNQUFNQyxVQUFVLENBQUNDLE9BQWNDLFNBQTBCO0lBQ3ZELE1BQU0sRUFBRUMsS0FBSSxFQUFFQyxLQUFJLEVBQUVDLFFBQU8sRUFBRSxHQUFHSDtJQUNoQyxPQUFRQztRQUNOLEtBQUtQLFFBQVFDLE9BQU87WUFBRTtnQkFDcEIsT0FBTztvQkFDTCxHQUFHSSxLQUFLO29CQUNSRixNQUFNTTtnQkFDUjtZQUNGO1FBQ0E7WUFDRSxNQUFNLElBQUlDLE1BQU0saUNBQWlDO0lBQ3JEO0FBQ0Y7QUFFMEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kbXNkLy4vc3JjL2NvbnRleHRzL0Rtc2RDb250ZXh0L3N0YXRlLnRzPzkyYjkiXSwic291cmNlc0NvbnRlbnQiOlsidHlwZSBVc2VyID0gYW55OyAvLyBSZXBsYWNlIGBhbnlgIHdpdGggdGhlIGFjdHVhbCB1c2VyIHR5cGVcblxuaW50ZXJmYWNlIFN0YXRlIHtcbiAgdXNlcjogVXNlciB8IG51bGw7XG59XG5cbmludGVyZmFjZSBBY3Rpb24ge1xuICB0eXBlOiBzdHJpbmc7XG4gIHBheWxvYWQ/OiBhbnk7XG4gIGRhdGE/OiBhbnk7XG59XG5cbmNvbnN0IGFjdGlvbnMgPSB7XG4gIGFkZFVzZXI6IFwiQUREX1VTRVJcIixcbn07XG5cbmNvbnN0IGluaXRpYWxTdGF0ZTogU3RhdGUgPSB7XG4gIHVzZXI6IG51bGwsXG59O1xuXG5jb25zdCByZWR1Y2VyID0gKHN0YXRlOiBTdGF0ZSwgYWN0aW9uOiBBY3Rpb24pOiBTdGF0ZSA9PiB7XG4gIGNvbnN0IHsgdHlwZSwgZGF0YSwgcGF5bG9hZCB9ID0gYWN0aW9uO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIGFjdGlvbnMuYWRkVXNlcjoge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIHVzZXI6IHBheWxvYWQsXG4gICAgICB9O1xuICAgIH1cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5kZWZpbmVkIHJlZHVjZXIgYWN0aW9uIHR5cGVcIik7XG4gIH1cbn07XG5cbmV4cG9ydCB7IGFjdGlvbnMsIGluaXRpYWxTdGF0ZSwgcmVkdWNlciB9O1xuIl0sIm5hbWVzIjpbImFjdGlvbnMiLCJhZGRVc2VyIiwiaW5pdGlhbFN0YXRlIiwidXNlciIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJkYXRhIiwicGF5bG9hZCIsIkVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/contexts/DmsdContext/state.ts\n");

/***/ }),

/***/ "./src/contexts/DmsdContext/useDmsd.ts":
/*!*********************************************!*\
  !*** ./src/contexts/DmsdContext/useDmsd.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _DmsdContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DmsdContext */ \"./src/contexts/DmsdContext/DmsdContext.ts\");\n\n\nconst useDmsd = ()=>(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_DmsdContext__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useDmsd);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGV4dHMvRG1zZENvbnRleHQvdXNlRG1zZC50cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQW1DO0FBQ0s7QUFFeEMsTUFBTUUsVUFBVSxJQUFNRixpREFBVUEsQ0FBQ0Msb0RBQVdBO0FBRTVDLGlFQUFlQyxPQUFPQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZG1zZC8uL3NyYy9jb250ZXh0cy9EbXNkQ29udGV4dC91c2VEbXNkLnRzP2JlMGYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlQ29udGV4dCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERtc2RDb250ZXh0IGZyb20gXCIuL0Rtc2RDb250ZXh0XCI7XG5cbmNvbnN0IHVzZURtc2QgPSAoKSA9PiB1c2VDb250ZXh0KERtc2RDb250ZXh0KTtcblxuZXhwb3J0IGRlZmF1bHQgdXNlRG1zZDtcbiJdLCJuYW1lcyI6WyJ1c2VDb250ZXh0IiwiRG1zZENvbnRleHQiLCJ1c2VEbXNkIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/contexts/DmsdContext/useDmsd.ts\n");

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @rainbow-me/rainbowkit/styles.css */ \"./node_modules/@rainbow-me/rainbowkit/dist/index.css\");\n/* harmony import */ var _rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/react */ \"next-auth/react\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @chakra-ui/react */ \"@chakra-ui/react\");\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var _wagmi__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../wagmi */ \"./src/wagmi.ts\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _contexts_DmsdContext__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/contexts/DmsdContext */ \"./src/contexts/DmsdContext/index.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__, wagmi__WEBPACK_IMPORTED_MODULE_4__, _wagmi__WEBPACK_IMPORTED_MODULE_5__]);\n([_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__, wagmi__WEBPACK_IMPORTED_MODULE_4__, _wagmi__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n\nfunction App({ Component , pageProps  }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__.ChakraProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(wagmi__WEBPACK_IMPORTED_MODULE_4__.WagmiConfig, {\n            client: _wagmi__WEBPACK_IMPORTED_MODULE_5__.client,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_auth_react__WEBPACK_IMPORTED_MODULE_2__.SessionProvider, {\n                session: pageProps.session,\n                refetchInterval: 0,\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_DmsdContext__WEBPACK_IMPORTED_MODULE_7__.DmsdProvider, {\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                        ...pageProps\n                    }, void 0, false, {\n                        fileName: \"/Users/wassim/Projects/Solidity/Workspace/alyra-graded-projects/DMSD/src/pages/_app.tsx\",\n                        lineNumber: 16,\n                        columnNumber: 13\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"/Users/wassim/Projects/Solidity/Workspace/alyra-graded-projects/DMSD/src/pages/_app.tsx\",\n                    lineNumber: 15,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/wassim/Projects/Solidity/Workspace/alyra-graded-projects/DMSD/src/pages/_app.tsx\",\n                lineNumber: 14,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/wassim/Projects/Solidity/Workspace/alyra-graded-projects/DMSD/src/pages/_app.tsx\",\n            lineNumber: 13,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/wassim/Projects/Solidity/Workspace/alyra-graded-projects/DMSD/src/pages/_app.tsx\",\n        lineNumber: 12,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBMkM7QUFDTztBQUNBO0FBQ2Q7QUFDRjtBQUNKO0FBRXdCO0FBRXZDLFNBQVNLLElBQUksRUFBRUMsVUFBUyxFQUFFQyxVQUFTLEVBQVksRUFBRTtJQUM5RCxxQkFDRSw4REFBQ04sNERBQWNBO2tCQUNiLDRFQUFDQyw4Q0FBV0E7WUFBQ0MsUUFBUUEsMENBQU1BO3NCQUN6Qiw0RUFBQ0gsNERBQWVBO2dCQUFDUSxTQUFTRCxVQUFVQyxPQUFPO2dCQUFFQyxpQkFBaUI7MEJBQzVELDRFQUFDTCwrREFBWUE7OEJBQ1gsNEVBQUNFO3dCQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTXBDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kbXNkLy4vc3JjL3BhZ2VzL19hcHAudHN4P2Y5ZDYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwiQHJhaW5ib3ctbWUvcmFpbmJvd2tpdC9zdHlsZXMuY3NzXCI7XG5pbXBvcnQgeyBTZXNzaW9uUHJvdmlkZXIgfSBmcm9tIFwibmV4dC1hdXRoL3JlYWN0XCI7XG5pbXBvcnQgeyBDaGFrcmFQcm92aWRlciB9IGZyb20gXCJAY2hha3JhLXVpL3JlYWN0XCI7XG5pbXBvcnQgeyBXYWdtaUNvbmZpZyB9IGZyb20gXCJ3YWdtaVwiO1xuaW1wb3J0IHsgY2xpZW50IH0gZnJvbSBcIi4uL3dhZ21pXCI7XG5pbXBvcnQgXCJAL3N0eWxlcy9nbG9iYWxzLmNzc1wiO1xuaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gXCJuZXh0L2FwcFwiO1xuaW1wb3J0IHsgRG1zZFByb3ZpZGVyIH0gZnJvbSBcIkAvY29udGV4dHMvRG1zZENvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8Q2hha3JhUHJvdmlkZXI+XG4gICAgICA8V2FnbWlDb25maWcgY2xpZW50PXtjbGllbnR9PlxuICAgICAgICA8U2Vzc2lvblByb3ZpZGVyIHNlc3Npb249e3BhZ2VQcm9wcy5zZXNzaW9ufSByZWZldGNoSW50ZXJ2YWw9ezB9PlxuICAgICAgICAgIDxEbXNkUHJvdmlkZXI+XG4gICAgICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICAgICAgPC9EbXNkUHJvdmlkZXI+XG4gICAgICAgIDwvU2Vzc2lvblByb3ZpZGVyPlxuICAgICAgPC9XYWdtaUNvbmZpZz5cbiAgICA8L0NoYWtyYVByb3ZpZGVyPlxuICApO1xufVxuIl0sIm5hbWVzIjpbIlNlc3Npb25Qcm92aWRlciIsIkNoYWtyYVByb3ZpZGVyIiwiV2FnbWlDb25maWciLCJjbGllbnQiLCJEbXNkUHJvdmlkZXIiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJzZXNzaW9uIiwicmVmZXRjaEludGVydmFsIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/wagmi.ts":
/*!**********************!*\
  !*** ./src/wagmi.ts ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"chains\": () => (/* binding */ chains),\n/* harmony export */   \"client\": () => (/* binding */ client)\n/* harmony export */ });\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var wagmi_chains__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wagmi/chains */ \"wagmi/chains\");\n/* harmony import */ var wagmi_providers_jsonRpc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! wagmi/providers/jsonRpc */ \"wagmi/providers/jsonRpc\");\n/* harmony import */ var wagmi_providers_alchemy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! wagmi/providers/alchemy */ \"wagmi/providers/alchemy\");\n/* harmony import */ var wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! wagmi/connectors/metaMask */ \"wagmi/connectors/metaMask\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([wagmi__WEBPACK_IMPORTED_MODULE_0__, wagmi_chains__WEBPACK_IMPORTED_MODULE_1__, wagmi_providers_jsonRpc__WEBPACK_IMPORTED_MODULE_2__, wagmi_providers_alchemy__WEBPACK_IMPORTED_MODULE_3__, wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_4__]);\n([wagmi__WEBPACK_IMPORTED_MODULE_0__, wagmi_chains__WEBPACK_IMPORTED_MODULE_1__, wagmi_providers_jsonRpc__WEBPACK_IMPORTED_MODULE_2__, wagmi_providers_alchemy__WEBPACK_IMPORTED_MODULE_3__, wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n/**\n * Tell wagmi which chains you want to support\n * To add a new chain simply import it and add it here\n * @see https://wagmi.sh/react/providers/configuring-chains\n */ const { chains , provider , webSocketProvider  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_0__.configureChains)([\n    wagmi_chains__WEBPACK_IMPORTED_MODULE_1__.polygonMumbai,\n    wagmi_chains__WEBPACK_IMPORTED_MODULE_1__.foundry\n], [\n    /**\n     * Uncomment this line to use Alchemy as your provider\n     * @see https://wagmi.sh/react/providers/alchemy\n     */ (0,wagmi_providers_alchemy__WEBPACK_IMPORTED_MODULE_3__.alchemyProvider)({\n        apiKey: process.env.ALCHEMY_API_KEY\n    }),\n    /**\n     * Tells wagmi to use the default RPC URL for each chain\n     * for some dapps the higher rate limits of Alchemy may be required\n     */ (0,wagmi_providers_jsonRpc__WEBPACK_IMPORTED_MODULE_2__.jsonRpcProvider)({\n        rpc: (chain)=>{\n            if (chain.id === wagmi_chains__WEBPACK_IMPORTED_MODULE_1__.foundry.id) {\n                return {\n                    http: \"http://localhost:8545\"\n                };\n            }\n            return {\n                http: chain.rpcUrls.default.http[0]\n            };\n        }\n    })\n]);\n/**\n * Export chains to be used by rainbowkit\n * @see https://wagmi.sh/react/providers/configuring-chains\n */ \n/**\n * Configures wagmi connectors for rainbowkit\n * @see https://www.rainbowkit.com/docs/custom-wallet-list\n * @see https://wagmi.sh/react/connectors\n */ const connector = new wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_4__.MetaMaskConnector({\n    chains\n});\n/**\n * Creates a singleton wagmi client for the app\n * @see https://wagmi.sh/react/client\n */ const client = (0,wagmi__WEBPACK_IMPORTED_MODULE_0__.createClient)({\n    autoConnect: true,\n    provider,\n    connectors: [\n        connector\n    ],\n    webSocketProvider\n});\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvd2FnbWkudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFzRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBRTlEOzs7O0NBSUMsR0FDRCxNQUFNLEVBQUVPLE9BQU0sRUFBRUMsU0FBUSxFQUFFQyxrQkFBaUIsRUFBRSxHQUFHVCxzREFBZUEsQ0FDN0Q7SUFBQ0csdURBQWFBO0lBQUVELGlEQUFPQTtDQUFDLEVBQ3hCO0lBQ0U7OztLQUdDLEdBQ0RHLHdFQUFlQSxDQUFDO1FBQUVLLFFBQVFDLFFBQVFDLEdBQUcsQ0FBQ0MsZUFBZTtJQUFFO0lBQ3ZEOzs7S0FHQyxHQUNEVCx3RUFBZUEsQ0FBQztRQUNkVSxLQUFLLENBQUNDLFFBQVU7WUFDZCxJQUFJQSxNQUFNQyxFQUFFLEtBQUtkLG9EQUFVLEVBQUU7Z0JBQzNCLE9BQU87b0JBQUVlLE1BQU07Z0JBQXdCO1lBQ3pDLENBQUM7WUFDRCxPQUFPO2dCQUFFQSxNQUFNRixNQUFNRyxPQUFPLENBQUNDLE9BQU8sQ0FBQ0YsSUFBSSxDQUFDLEVBQUU7WUFBQztRQUMvQztJQUNGO0NBQ0Q7QUFHSDs7O0NBR0MsR0FDaUI7QUFFbEI7Ozs7Q0FJQyxHQUNELE1BQU1HLFlBQVksSUFBSWQsd0VBQWlCQSxDQUFDO0lBQ3RDQztBQUNGO0FBRUE7OztDQUdDLEdBQ00sTUFBTWMsU0FBU3BCLG1EQUFZQSxDQUFDO0lBQ2pDcUIsYUFBYSxJQUFJO0lBQ2pCZDtJQUNBZSxZQUFZO1FBQUNIO0tBQVU7SUFDdkJYO0FBQ0YsR0FBRyIsInNvdXJjZXMiOlsid2VicGFjazovL2Rtc2QvLi9zcmMvd2FnbWkudHM/NWIzNSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb25maWd1cmVDaGFpbnMsIGNyZWF0ZUNsaWVudCB9IGZyb20gXCJ3YWdtaVwiO1xuaW1wb3J0IHsgZm91bmRyeSwgcG9seWdvbk11bWJhaSB9IGZyb20gXCJ3YWdtaS9jaGFpbnNcIjtcbmltcG9ydCB7IGpzb25ScGNQcm92aWRlciB9IGZyb20gXCJ3YWdtaS9wcm92aWRlcnMvanNvblJwY1wiO1xuaW1wb3J0IHsgYWxjaGVteVByb3ZpZGVyIH0gZnJvbSBcIndhZ21pL3Byb3ZpZGVycy9hbGNoZW15XCI7XG5pbXBvcnQgeyBNZXRhTWFza0Nvbm5lY3RvciB9IGZyb20gXCJ3YWdtaS9jb25uZWN0b3JzL21ldGFNYXNrXCI7XG5cbi8qKlxuICogVGVsbCB3YWdtaSB3aGljaCBjaGFpbnMgeW91IHdhbnQgdG8gc3VwcG9ydFxuICogVG8gYWRkIGEgbmV3IGNoYWluIHNpbXBseSBpbXBvcnQgaXQgYW5kIGFkZCBpdCBoZXJlXG4gKiBAc2VlIGh0dHBzOi8vd2FnbWkuc2gvcmVhY3QvcHJvdmlkZXJzL2NvbmZpZ3VyaW5nLWNoYWluc1xuICovXG5jb25zdCB7IGNoYWlucywgcHJvdmlkZXIsIHdlYlNvY2tldFByb3ZpZGVyIH0gPSBjb25maWd1cmVDaGFpbnMoXG4gIFtwb2x5Z29uTXVtYmFpLCBmb3VuZHJ5XSxcbiAgW1xuICAgIC8qKlxuICAgICAqIFVuY29tbWVudCB0aGlzIGxpbmUgdG8gdXNlIEFsY2hlbXkgYXMgeW91ciBwcm92aWRlclxuICAgICAqIEBzZWUgaHR0cHM6Ly93YWdtaS5zaC9yZWFjdC9wcm92aWRlcnMvYWxjaGVteVxuICAgICAqL1xuICAgIGFsY2hlbXlQcm92aWRlcih7IGFwaUtleTogcHJvY2Vzcy5lbnYuQUxDSEVNWV9BUElfS0VZISB9KSxcbiAgICAvKipcbiAgICAgKiBUZWxscyB3YWdtaSB0byB1c2UgdGhlIGRlZmF1bHQgUlBDIFVSTCBmb3IgZWFjaCBjaGFpblxuICAgICAqIGZvciBzb21lIGRhcHBzIHRoZSBoaWdoZXIgcmF0ZSBsaW1pdHMgb2YgQWxjaGVteSBtYXkgYmUgcmVxdWlyZWRcbiAgICAgKi9cbiAgICBqc29uUnBjUHJvdmlkZXIoe1xuICAgICAgcnBjOiAoY2hhaW4pID0+IHtcbiAgICAgICAgaWYgKGNoYWluLmlkID09PSBmb3VuZHJ5LmlkKSB7XG4gICAgICAgICAgcmV0dXJuIHsgaHR0cDogXCJodHRwOi8vbG9jYWxob3N0Ojg1NDVcIiB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGh0dHA6IGNoYWluLnJwY1VybHMuZGVmYXVsdC5odHRwWzBdIH07XG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuKTtcblxuLyoqXG4gKiBFeHBvcnQgY2hhaW5zIHRvIGJlIHVzZWQgYnkgcmFpbmJvd2tpdFxuICogQHNlZSBodHRwczovL3dhZ21pLnNoL3JlYWN0L3Byb3ZpZGVycy9jb25maWd1cmluZy1jaGFpbnNcbiAqL1xuZXhwb3J0IHsgY2hhaW5zIH07XG5cbi8qKlxuICogQ29uZmlndXJlcyB3YWdtaSBjb25uZWN0b3JzIGZvciByYWluYm93a2l0XG4gKiBAc2VlIGh0dHBzOi8vd3d3LnJhaW5ib3draXQuY29tL2RvY3MvY3VzdG9tLXdhbGxldC1saXN0XG4gKiBAc2VlIGh0dHBzOi8vd2FnbWkuc2gvcmVhY3QvY29ubmVjdG9yc1xuICovXG5jb25zdCBjb25uZWN0b3IgPSBuZXcgTWV0YU1hc2tDb25uZWN0b3Ioe1xuICBjaGFpbnMsXG59KTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2luZ2xldG9uIHdhZ21pIGNsaWVudCBmb3IgdGhlIGFwcFxuICogQHNlZSBodHRwczovL3dhZ21pLnNoL3JlYWN0L2NsaWVudFxuICovXG5leHBvcnQgY29uc3QgY2xpZW50ID0gY3JlYXRlQ2xpZW50KHtcbiAgYXV0b0Nvbm5lY3Q6IHRydWUsXG4gIHByb3ZpZGVyLFxuICBjb25uZWN0b3JzOiBbY29ubmVjdG9yXSxcbiAgd2ViU29ja2V0UHJvdmlkZXIsXG59KTtcbiJdLCJuYW1lcyI6WyJjb25maWd1cmVDaGFpbnMiLCJjcmVhdGVDbGllbnQiLCJmb3VuZHJ5IiwicG9seWdvbk11bWJhaSIsImpzb25ScGNQcm92aWRlciIsImFsY2hlbXlQcm92aWRlciIsIk1ldGFNYXNrQ29ubmVjdG9yIiwiY2hhaW5zIiwicHJvdmlkZXIiLCJ3ZWJTb2NrZXRQcm92aWRlciIsImFwaUtleSIsInByb2Nlc3MiLCJlbnYiLCJBTENIRU1ZX0FQSV9LRVkiLCJycGMiLCJjaGFpbiIsImlkIiwiaHR0cCIsInJwY1VybHMiLCJkZWZhdWx0IiwiY29ubmVjdG9yIiwiY2xpZW50IiwiYXV0b0Nvbm5lY3QiLCJjb25uZWN0b3JzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/wagmi.ts\n");

/***/ }),

/***/ "./node_modules/@rainbow-me/rainbowkit/dist/index.css":
/*!************************************************************!*\
  !*** ./node_modules/@rainbow-me/rainbowkit/dist/index.css ***!
  \************************************************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "next-auth/react":
/*!**********************************!*\
  !*** external "next-auth/react" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("next-auth/react");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@chakra-ui/react":
/*!***********************************!*\
  !*** external "@chakra-ui/react" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = import("@chakra-ui/react");;

/***/ }),

/***/ "wagmi":
/*!************************!*\
  !*** external "wagmi" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi");;

/***/ }),

/***/ "wagmi/chains":
/*!*******************************!*\
  !*** external "wagmi/chains" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/chains");;

/***/ }),

/***/ "wagmi/connectors/metaMask":
/*!********************************************!*\
  !*** external "wagmi/connectors/metaMask" ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/connectors/metaMask");;

/***/ }),

/***/ "wagmi/providers/alchemy":
/*!******************************************!*\
  !*** external "wagmi/providers/alchemy" ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/providers/alchemy");;

/***/ }),

/***/ "wagmi/providers/jsonRpc":
/*!******************************************!*\
  !*** external "wagmi/providers/jsonRpc" ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/providers/jsonRpc");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/_app.tsx"));
module.exports = __webpack_exports__;

})();